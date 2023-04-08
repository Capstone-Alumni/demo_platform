import { NextApiRequest } from 'next';
import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { genTenantId } from '@share/utils/genTenantId';
import { createSubdomain, deleteSubdomain } from '@share/utils/subdomainAPI';
import axios from 'axios';
import { hashSync } from 'bcrypt';

import {
  CreateTenantServiceProps,
  GetTenantListServiceProps,
  RegisterTenantServiceProps,
  UpdateTenantInfoByIdServiceProps,
} from '../types';
import { getVnpUrl } from '../helper';

const cloneSchema = async (tenant: any) => {
  const alumniId = tenant.alumni?.[0].id;
  const accountId = tenant.alumni?.[0].account.id;
  const accountEmail = tenant.alumni?.[0].account.email;
  await mainAppPrisma.$executeRaw`
    SELECT template.clone_schema('template', ${tenant.tenantId});
  `;
  const insertAlumniQuery = `
    INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, 'SCHOOL_ADMIN', 'APPROVED')
  `;
  await mainAppPrisma.$executeRawUnsafe(
    insertAlumniQuery,
    alumniId,
    tenant.tenantId,
    accountId,
    accountEmail,
  );
};

export default class TenantService {
  static getList = async ({ params }: GetTenantListServiceProps) => {
    const { name, tenantId, page, limit } = params;

    const whereFilter = {
      AND: [
        { tenantId: { contains: tenantId } },
        { name: { contains: name } },
        { archived: false },
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
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          alumni: {
            where: {
              accessLevel: 'SCHOOL_ADMIN',
            },
            include: {
              account: {
                select: {
                  id: true,
                  email: true,
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

  static create = async (values: CreateTenantServiceProps) => {
    /** pre-check */
    const user = await prisma.account.findUnique({
      where: {
        email: values.email,
      },
    });

    if (user) {
      throw new Error('existed user');
    }

    const existingTenantId = await prisma.tenant.findUnique({
      where: {
        tenantId: values.tenantId,
      },
    });

    if (existingTenantId) {
      throw new Error('existed tenantId');
    }

    const existingSubdomain = await prisma.tenant.findUnique({
      where: {
        subdomain: values.subdomain,
      },
    });

    if (existingSubdomain) {
      throw new Error('existed subdomain');
    }

    /** Create subdomain */
    if (process.env.GEN_DOMAIN) {
      const response = await fetch(
        `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
        {
          body: `{\n  "name": "${values.subdomain}${process.env.MAINAPP_DOMAIN}"\n}`,
          headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      );

      const data = await response.json();

      // Domain is already owned by another team but you can request delegation to access it
      if (data.error?.code === 'forbidden') {
        throw new Error('forbidden');
      }

      // Domain is already being used by a different project
      if (data.error?.code === 'domain_taken') {
        throw new Error('existed subdomain');
      }
    }

    /** Create database  */
    const encryptedPassword = hashSync(values.password, 10);

    const newTenant = await prisma.tenant.create({
      data: {
        name: values.name,
        tenantId: values.tenantId,
        description: values.description,
        logo: values.logo,
        subdomain: values.subdomain,
        alumni: {
          create: [
            {
              accessLevel: 'SCHOOL_ADMIN',
              account: {
                create: {
                  email: values.email,
                  password: encryptedPassword,
                },
              },
            },
          ],
        },
      },
    });

    /** Create schema in mainApp */
    await mainAppPrisma.$executeRaw`
      SELECT template.clone_schema('template', ${values.tenantId});
    `;

    return newTenant;
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
        subcriptionEndTime: {
          gt: new Date(),
        },
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
      data: {
        subdomain: data.subdomain,
        name: data.name,
        description: data.description,
        logo: data.logo,
        background1: data.background1,
        background2: data.background2,
        background3: data.background3,
        theme: data.theme,
      },
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

    const [deletedTenant] = await prisma.$transaction([
      prisma.tenant.update({
        where: {
          id: id,
        },
        data: {
          subdomain: null,
          archived: true,
        },
      }),
      prisma.alumni.deleteMany({
        where: {
          tenantId: id,
        },
      }),
    ]);

    return deletedTenant;
  };

  static registerTenant = async (values: RegisterTenantServiceProps) => {
    /** pre-check */
    const user = await prisma.account.findUnique({
      where: {
        email: values.email,
      },
    });

    if (user) {
      throw new Error('existed');
    }

    const domain = `${values.subdomain}${process.env.MAINAPP_DOMAIN}`;
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

    /** Gen data */
    const tenantId = genTenantId(values.name);

    /** Create database  */
    const encryptedPassword = hashSync(values.password, 10);

    const newTenant = await prisma.tenant.create({
      data: {
        name: values.name,
        logo: values.logo,
        tenantId: tenantId,
        approved: false,
        subcriptionEndTime: new Date(),
        provinceCodename: values.provinceCodename,
        provinceName: values.provinceName,
        cityCodename: values.cityCodename,
        cityName: values.cityName,
        address: values.address,
        subdomain: values.subdomain,
        plan: {
          connect: {
            name: values.plan,
          },
        },
        alumni: {
          create: [
            {
              accessLevel: 'SCHOOL_ADMIN',
              isOwner: true,
              account: {
                create: {
                  email: values.email,
                  password: encryptedPassword,
                },
              },
            },
          ],
        },
      },
    });

    return newTenant;
  };

  static activateById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
      include: {
        alumni: {
          where: {
            isOwner: true,
          },
          include: {
            account: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new Error('tenant is non-existed');
    }

    const subdomain = tenant.tenantId.replace('_', '');

    const domain = `${subdomain}${process.env.MAINAPP_DOMAIN}`;
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
    const tenantId = tenant.id;
    const alumniId = tenant.alumni?.[0].id;
    const accountId = tenant.alumni?.[0].account.id;
    const accountEmail = tenant.alumni?.[0].account.email;
    await mainAppPrisma.$executeRaw`
      SELECT template.clone_schema('template', ${tenant.tenantId});
    `;
    const insertAlumniQuery = `
      INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $1, $2, $3, 'SCHOOL_ADMIN', 'APPROVED')
    `;
    await mainAppPrisma.$executeRawUnsafe(
      insertAlumniQuery,
      alumniId,
      accountId,
      accountEmail,
    );

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        subdomain: subdomain,
        approved: true,
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
          include: {
            account: true,
          },
        },
        plan: true,
      },
    });

    if (!tenant || !tenant?.plan || !tenant?.planId) {
      throw new Error('tenant is non-existed');
    }

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const vnpUrl = await getVnpUrl({
      ipAddr: ipAddr as string,
      amount: tenant.plan.price,
      orderDescription: 'thanh_toan_hoa_don_the_alumni_app',
      orderType: 250000,
      tenantId: tenant.id,
      planId: tenant.planId,
    });

    // // run async
    axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
      to: tenant.alumni[0].account.email,
      subject: 'Đăng ký Alumni App',
      text: `
        Kính gửi anh/chị,
        
        Cảm ơn anh/chị đã lựa chọn The Alumn App. Mời anh/chị dùng link dưới đây để thanh toán và hoàn tất quá trình đăng ký.
        ${vnpUrl}
      `,
      html: `
        <p>
          Kính gửi anh/chị,
          <br /><br />
          Cảm ơn anh/chị đã lựa chọn The Alumn App. Mời anh/chị dùng link dưới đây để thanh toán và hoàn tất quá trình đăng ký.
          <a href="${vnpUrl}">Link thanh toán</a>
        </p>
      `,
    });

    /** Create schema in mainApp */
    cloneSchema(tenant);

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        approved: true,
      },
    });

    return newTenant;
  };

  static deactivateById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });

    if (!tenant) {
      throw new Error('tenant is non-existed');
    }

    const domain = `${tenant.subdomain}${process.env.MAINAPP_DOMAIN}`;

    if (process.env.GEN_DOMAIN) {
      await axios({
        method: 'DELETE',
        url: `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
      });
    }

    /** Create schema in mainApp */
    const query = `DROP SCHEMA IF EXISTS ${tenant.tenantId} CASCADE;`;
    await mainAppPrisma.$executeRawUnsafe(query);

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        subdomain: null,
        approved: false,
      },
    });

    return newTenant;
  };

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
        OR: [
          {
            tenantId: id,
          },
          {
            id: id,
          },
        ],
      },
      select: {
        vnp_tmnCode: true,
        vnp_hashSecret: true,
      },
    });

    return data;
  };
}
