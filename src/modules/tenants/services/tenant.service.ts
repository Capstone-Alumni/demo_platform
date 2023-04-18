import { NextApiRequest } from 'next';
import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { createSubdomain, deleteSubdomain } from '@share/utils/subdomainAPI';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cuid from 'cuid';
import { hashSync } from 'bcrypt';

import {
  CreateTenantServiceProps,
  GetTenantListServiceProps,
  RegisterTenantServiceProps,
  UpdateTenantInfoByIdServiceProps,
} from '../types';
import { getVnpUrl } from '../helper';
import getSubscriptionDisplay from '@share/utils/getSubscriptionDisplay';

const cloneSchema = async (tenant: any) => {
  const alumni = tenant.alumni?.[0];
  await mainAppPrisma.$executeRaw`
    SELECT template.clone_schema('template', ${tenant.id});
  `;
  const insertAlumniQuery = `
    INSERT INTO ${tenant.id}.alumni (id, tenant_id, is_owner) values ($1, $2, true)
  `;
  await mainAppPrisma.$executeRawUnsafe(
    insertAlumniQuery,
    alumni.id,
    tenant.id,
  );

  const insertAlumniInformationQuery = `
    INSERT INTO ${tenant.id}.informations (id, alumni_id, full_name, email) values ($1, $2, $3, $4)
  `;
  try {
    await mainAppPrisma.$executeRawUnsafe(
      insertAlumniInformationQuery,
      cuid(),
      alumni.id,
      alumni.fullName,
      alumni.accountEmail,
    );
  } catch (err) {
    console.log(err);
  }
};

export default class TenantService {
  static getList = async ({ params }: GetTenantListServiceProps) => {
    const { name, page, limit, planName } = params;

    const whereFilter = {
      AND: [
        { name: { contains: name } },
        { archived: false },
        {
          plan: {
            name: planName,
          },
        },
      ],
    };

    const [totalTenantItem, TenantItems] = await prisma.$transaction([
      prisma.tenant.count({
        where: whereFilter,
      }),
      prisma.tenant.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereFilter,
        orderBy: [
          {
            requestStatus: 'asc',
          },
          {
            subscriptionEndTime: 'asc',
          },
        ],
        include: {
          alumni: {
            where: {
              isOwner: true,
            },
            select: {
              id: true,
              tenantId: true,
              accountEmail: true,
              fullName: true,
              isOwner: true,
            },
          },
          _count: {
            select: {
              transactions: {
                where: {
                  paymentStatus: 1,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      totalItems: totalTenantItem,
      items: TenantItems,
      itemPerPage: limit,
    };
  };

  static registerTenant = async (values: RegisterTenantServiceProps) => {
    /** pre-check */
    const user = await prisma.alumni.findMany({
      where: {
        accountEmail: values.email,
        isOwner: true,
      },
      include: {
        tenant: true,
      },
    });

    if (user && user.length > 0 && user.find(u => u.tenant.requestStatus < 2)) {
      throw new Error('existed');
    }

    /** Add info  */
    const encryptedPassword = hashSync(values.password, 10);

    const newTenant = await prisma.tenant.create({
      data: {
        name: values.name,
        logo: values.logo,
        subscriptionEndTime: new Date(),
        provinceCodename: values.provinceCodename,
        provinceName: values.provinceName,
        cityCodename: values.cityCodename,
        cityName: values.cityName,
        address: values.address,
        subdomain: values.subdomain,
        evidenceUrl: values.evidenceUrl,
        plan: {
          connect: {
            name: values.plan,
          },
        },
        alumni: {
          create: [
            {
              fullName: values.fullName,
              isOwner: true,
              accountEmail: values.email,
              password: encryptedPassword,
            },
          ],
        },
      },
    });

    return newTenant;
  };

  static rejectById = async (id: string, req: NextApiRequest) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
      include: {
        alumni: {
          where: {
            isOwner: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new Error('tenant is non-existed');
    }

    // // run async
    axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
      to: tenant.alumni[0].accountEmail,
      subject: 'Từ chối đơn đăng ký Alumni App',
      text: `
<pre>
Kính gửi,

Thông tin đăng ký của bạn chưa chính xác, bạn vui lòng kiểm tra thông tin và đăng ký lại.
</pre>
      `,
    });

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        requestStatus: 2,
        subdomain: null,
      },
    });

    return newTenant;
  };

  static approveById = async (id: string, req: NextApiRequest) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
      include: {
        alumni: {
          where: {
            isOwner: true,
          },
        },
        plan: true,
      },
    });

    if (!tenant || !tenant?.plan || !tenant?.planId) {
      throw new Error('tenant is non-existed');
    }

    // const ipAddr =
    //   req.headers['x-forwarded-for'] ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress;

    // const vnpUrl = await getVnpUrl({
    //   ipAddr: ipAddr as string,
    //   amount: tenant.plan.price,
    //   orderDescription: 'thanh_toan_hoa_don_the_alumni_app',
    //   orderType: 250000,
    //   tenantId: tenant.id,
    //   planId: tenant.planId,
    // });

    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 72,
        data: {
          // vnpUrl: vnpUrl,
          amount: tenant.plan.price,
          orderDescription: 'thanh_toan_hoa_don_the_alumni_app',
          orderType: 250000,
          tenantId: tenant.id,
          planId: tenant.planId,
        },
      },
      tokenSecret,
    );

    // // run async
    const host = process.env.NEXTAUTH_URL;
    axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
      to: tenant.alumni[0].accountEmail,
      subject: 'Đăng ký Alumni App',
      text: `
<pre>
Kính gửi,
<br /><br />
Cảm ơn bạn đã lựa chọn The Alumn App. Mời bạn dùng link dưới đây để thanh toán và hoàn tất quá trình đăng ký.
<a href="${host}/api/payment?token=${token}">Link thanh toán</a>
* Link thanh toán sẽ hết hạn sau 72h.

Gói ${getSubscriptionDisplay(tenant.plan.name)}
Số tiền: ${tenant.plan.price} VNĐ
Số ngày gia hạn: ${tenant.plan.duration}
Ngày bắt đầu gia hạn: tính từ lúc thanh toán thành công
</pre>
      `,
    });

    const domain = `${tenant.subdomain}${process.env.MAINAPP_DOMAIN}`;
    /** Create subdomain */
    if (process.env.GEN_DOMAIN) {
      const payload = {
        name: domain,
      };

      const response = await axios({
        method: 'POST',
        url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });

      const { data } = response;

      // const data = await response.json();

      // Domain is already owned by another team but you can request delegation to access it
      if (data.error?.code === 'forbidden') {
        throw new Error('forbidden');
      }

      // Domain is already being used by a different project
      if (data.error?.code === 'domain_taken') {
        throw new Error('existed subdomain');
      }
    }

    /** Create schema in mainApp */
    cloneSchema(tenant);

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        requestStatus: 1,
        paymentToken: token,
      },
    });

    return newTenant;
  };

  static resendPaymentById = async (id: string, req: NextApiRequest) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
      include: {
        alumni: {
          where: {
            isOwner: true,
          },
        },
        plan: true,
      },
    });

    if (
      !tenant ||
      !tenant?.plan ||
      !tenant?.planId ||
      tenant.requestStatus !== 1
    ) {
      throw new Error('tenant is non-existed');
    }

    // const ipAddr =
    //   req.headers['x-forwarded-for'] ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress;

    // const vnpUrl = await getVnpUrl({
    //   ipAddr: ipAddr as string,
    //   amount: tenant.plan.price,
    //   orderDescription: 'thanh_toan_hoa_don_the_alumni_app',
    //   orderType: 250000,
    //   tenantId: tenant.id,
    //   planId: tenant.planId,
    // });

    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 72,
        data: {
          amount: tenant.plan.price,
          orderDescription: 'thanh_toan_hoa_don_the_alumni_app',
          orderType: 250000,
          tenantId: tenant.id,
          planId: tenant.planId,
        },
      },
      tokenSecret,
    );
    await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        paymentToken: token,
      },
    });

    // // run async
    const host = process.env.NEXTAUTH_URL;
    axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
      to: tenant.alumni[0].accountEmail,
      subject: 'Gia hạn Alumni App',
      text: `
<pre>
Kính gửi,
<br /><br />
Mời bạn dùng link dưới đây để thanh toán và gia hạn tài khoản của mình.
<a href="${host}/api/payment?token=${token}">Link thanh toán</a>
* Link thanh toán sẽ hết hạn sau 72h.

Gói ${getSubscriptionDisplay(tenant.plan.name)}
Số tiền: ${tenant.plan.price} VNĐ
Số ngày gia hạn thêm: ${tenant.plan.duration}
</pre>
      `,
    });

    return tenant;
  };

  static getById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });

    return tenant;
  };

  static getBySubdomain = async (subdomain: string) => {
    const Tenant = await prisma.tenant.findFirst({
      where: {
        subdomain: subdomain,
        subscriptionEndTime: {
          gt: new Date(),
        },
      },
      include: {
        plan: true,
      },
    });

    return Tenant;
  };

  static updateInfoById = async (
    id: string,
    data: UpdateTenantInfoByIdServiceProps,
  ) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });
    if (!tenant) {
      throw new Error('tenant not existed');
    }

    if (data.subdomain && data.subdomain !== tenant.subdomain) {
      const existedSubdomain = await prisma.tenant.findUnique({
        where: { subdomain: data.subdomain },
      });
      if (existedSubdomain) {
        throw new Error('subdomain existed');
      }

      if (process.env.GEN_DOMAIN) {
        if (tenant.subdomain) {
          await deleteSubdomain(tenant.subdomain);
        }
        await createSubdomain(data.subdomain);
      }
    }

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: data,
    });

    return newTenant;
  };

  static deleteById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });

    if (!tenant) {
      throw new Error('tenant is not existed');
    }

    const domain = `${tenant.subdomain}${process.env.MAINAPP_DOMAIN}`;

    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: 'DELETE',
      },
    );

    await response.json();

    await prisma.alumni.deleteMany({
      where: {
        tenantId: id,
      },
    });
    const deletedTenant = await prisma.tenant.delete({
      where: {
        id: id,
      },
    });

    return deletedTenant;
  };

  // // bỏ
  // static activateById = async (id: string) => {
  //   const tenant = await prisma.tenant.findUnique({
  //     where: { id: id },
  //     include: {
  //       alumni: {
  //         where: {
  //           isOwner: true,
  //         },
  //         include: {
  //           account: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!tenant) {
  //     throw new Error('tenant is non-existed');
  //   }

  //   const subdomain = tenant.tenantId.replace('_', '');

  //   const domain = `${subdomain}${process.env.MAINAPP_DOMAIN}`;
  //   /** Create subdomain */
  //   if (process.env.GEN_DOMAIN) {
  //     const payload = {
  //       name: domain,
  //     };

  //     const response = await axios({
  //       method: 'POST',
  //       url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
  //       data: payload,
  //       headers: {
  //         Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
  //         'Content-Type': 'application/json',
  //         accept: 'application/json',
  //       },
  //     });

  //     const { data } = response;

  //     // const data = await response.json();

  //     // Domain is already owned by another team but you can request delegation to access it
  //     if (data.error?.code === 'forbidden') {
  //       throw new Error('forbidden');
  //     }

  //     // Domain is already being used by a different project
  //     if (data.error?.code === 'domain_taken') {
  //       throw new Error('existed subdomain');
  //     }
  //   }
  //   /** Create schema in mainApp */
  //   const tenantId = tenant.id;
  //   const alumniId = tenant.alumni?.[0].id;
  //   const accountId = tenant.alumni?.[0].account.id;
  //   const accountEmail = tenant.alumni?.[0].account.email;
  //   await mainAppPrisma.$executeRaw`
  //     SELECT template.clone_schema('template', ${tenant.tenantId});
  //   `;
  //   const insertAlumniQuery = `
  //     INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $1, $2, $3, 'SCHOOL_ADMIN', 'APPROVED')
  //   `;
  //   await mainAppPrisma.$executeRawUnsafe(
  //     insertAlumniQuery,
  //     alumniId,
  //     accountId,
  //     accountEmail,
  //   );

  //   const newTenant = await prisma.tenant.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       subdomain: subdomain,
  //       approved: true,
  //     },
  //   });

  //   return newTenant;
  // };

  // // bỏ
  // static deactivateById = async (id: string) => {
  //   const tenant = await prisma.tenant.findUnique({
  //     where: { id: id },
  //   });

  //   if (!tenant) {
  //     throw new Error('tenant is non-existed');
  //   }

  //   const domain = `${tenant.subdomain}${process.env.MAINAPP_DOMAIN}`;

  //   if (process.env.GEN_DOMAIN) {
  //     await axios({
  //       method: 'DELETE',
  //       url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
  //       headers: {
  //         Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
  //       },
  //     });
  //   }

  //   /** Create schema in mainApp */
  //   const query = `DROP SCHEMA IF EXISTS ${tenant.tenantId} CASCADE;`;
  //   await mainAppPrisma.$executeRawUnsafe(query);

  //   const newTenant = await prisma.tenant.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       subdomain: null,
  //       approved: false,
  //     },
  //   });

  //   return newTenant;
  // };

  static updateVnpayById = async (
    id: string,
    data: { tmnCode: string; hashSecret: string },
  ) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });
    if (!tenant) {
      throw new Error('tenant not existed');
    }

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        vnp_tmnCode: data.tmnCode,
        vnp_hashSecret: data.hashSecret,
      },
    });

    return newTenant;
  };

  static getVnpayById = async (id: string) => {
    const data = await prisma.tenant.findFirst({
      where: {
        id: id,
      },
      select: {
        vnp_tmnCode: true,
        vnp_hashSecret: true,
      },
    });

    return data;
  };
}
