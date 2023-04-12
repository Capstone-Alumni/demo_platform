import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { hashSync } from 'bcrypt';
import cuid from 'cuid';

import {
  CreateManyMemberServiceProps,
  CreateMemberServiceProps,
  ExternalCreateMemberServiceProps,
  GetMemberListServiceProps,
  UpdateMemberInfoByIdServiceProps,
} from '../types';
import axios from 'axios';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';
import sendEmail from '@share/utils/sendEmail';
import { Account, Alumni } from '@prisma/client';

const isTenantExisted = async (id: string) => {
  if (!id) {
    throw new Error('tenant not exist');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { tenantId: id },
  });

  if (!tenant) {
    throw new Error('tenant not exist');
  }

  return tenant;
};

const dualWriteAlumniProfile = async (
  {
    tenantId,
    fullName,
    gradeClass,
    email,
    phone,
    dateOfBirth,
    facebook,
  }: CreateMemberServiceProps,
  account: Account,
  alumni: Alumni,
  rawPassword?: string,
) => {
  console.log('dual write');
  // Tạo account
  const insertAlumniQuery = `
    INSERT INTO ${tenantId}.alumni (id, tenant_id, account_id) values ($1, $2, $3)
  `;
  await mainAppPrisma.$executeRawUnsafe(
    insertAlumniQuery,
    alumni.id,
    alumni.tenantId,
    alumni.accountId,
  );

  // Tạo liên kết alumni - class
  const insertAlumniClassRelationshipQuery = `
    INSERT INTO ${tenantId}.alumni_to_class (id, alum_class_id, alumni_id) values ($1, $2, $3)
  `;
  const flattenClass = gradeClass.reduce((red: any[], { alumClass }) => {
    return red.concat(alumClass.map(cl => cl.value));
  }, []);
  await Promise.all(
    flattenClass.map(item =>
      mainAppPrisma.$executeRawUnsafe(
        insertAlumniClassRelationshipQuery,
        cuid(),
        item,
        alumni.id,
      ),
    ),
  );

  // Tạo profile
  const insertAlumniInformationQuery = `
    INSERT INTO ${tenantId}.informations (id, alumni_id, full_name, email, phone, facebook_url, date_of_birth) values ($1, $2, $3, $4, $5, $6, $7)
  `;
  await mainAppPrisma.$executeRawUnsafe(
    insertAlumniInformationQuery,
    cuid(),
    alumni.id,
    fullName,
    email,
    phone,
    facebook,
    dateOfBirth ? new Date(dateOfBirth) : undefined,
  );
};

export default class MemberService {
  static create = async ({
    tenantId,
    ...memberData
  }: CreateMemberServiceProps) => {
    console.log('create member');
    const tenant = await isTenantExisted(tenantId);

    if (!memberData.fullName || memberData?.gradeClass?.length === 0) {
      throw new Error('invalid data');
    }

    let account: any = {};

    if (memberData.email) {
      account = await prisma.account.findUnique({
        where: { email: memberData.email },
      });

      console.log('account: ', account);

      // Case 4
      if (!account) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const encryptedRandomPassword = hashSync(randomPassword, 10);
        account = await prisma.account.create({
          data: {
            email: memberData.email,
            password: encryptedRandomPassword,
          },
        });

        const newMember = await prisma.alumni.create({
          data: {
            account: {
              connect: {
                id: account.id,
              },
            },
            tenant: {
              connect: {
                id: tenant.id,
              },
            },
          },
        });

        console.log('alumni: ', newMember);

        dualWriteAlumniProfile(
          { tenantId, ...memberData },
          account,
          newMember,
          randomPassword,
        );

        const host = getTenantHost(tenant.subdomain || '');
        sendEmail(
          account.email,
          'Mời thành viên',
          `<pre>
          Chào ${memberData.fullName},
              
          <a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu sinh viên.
          Địa chỉ website: ${host}
          Tài khoản đăng nhập:
          - email: ${account.email}
          - password: ${randomPassword}
  
          *Lưu ý: đổi password sau khi đăng nhập
          </pre>
              
            `,
        );

        return newMember;
      }
    }

    // const member = await prisma.alumni.findUnique({
    //   where: {
    //     tenantId_accountId: {
    //       tenantId: tenantId,
    //       accountId: account.id || null,
    //     },
    //   },
    // });

    // if (member) {
    //   throw new Error('member already existed');
    // }

    // const newMember = await prisma.alumni.create({
    //   data: {
    //     account: {
    //       connect: {
    //         email: email,
    //       },
    //     },
    //     tenant: {
    //       connect: {
    //         id: tenantId,
    //       },
    //     },
    //   },
    // });

    // const insertAlumniQuery = `
    //   INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, $5::"template"."AccessLevel", 'APPROVED')
    // `;
    // await mainAppPrisma.$executeRawUnsafe(
    //   insertAlumniQuery,
    //   newMember.id,
    //   tenant.tenantId,
    //   user.id,
    //   user.email,
    //   accessLevel,
    // );

    // const host = getTenantHost(tenant.subdomain || '');

    // // // run async
    // axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
    //   to: user.email,
    //   subject: 'Mời thành viên',
    //   text: `
    //         Kính gửi anh/chị,

    //         ${tenant.name} mời bạn sử dụng hệ thống kết nối cựu sinh viên.
    //         Trang web: ${host}
    //         Tài khoản đăng nhập:
    //         - email: ${user.email}
    //         - password: ${password}
    //       `,
    // });

    return null;
  };

  static createMany = async ({
    memberListData,
    tenantId,
  }: CreateManyMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    memberListData.forEach(({ email, password }) => {
      if (!email || !password) {
        throw new Error('invalid data');
      }
    });

    const formattedData = await Promise.all(
      memberListData.map(async ({ email, password, accessLevel }) => {
        const encryptedPassword = hashSync(password, 10);

        const user = await prisma.account.findUnique({
          where: { email: email },
        });

        return {
          accountId: user?.id,
          accessLevel: accessLevel,
          email: email,
          password: encryptedPassword,
        };
      }),
    );

    const res = await prisma.$transaction(
      formattedData.map(({ accountId, email, password, accessLevel }) => {
        return prisma.alumni.upsert({
          where: {
            tenantId_accountId: {
              tenantId: tenantId,
              accountId: accountId || '',
            },
          },
          update: {},
          create: {
            accessLevel: accessLevel,
            account: {
              connectOrCreate: {
                where: { email: email },
                create: { email: email, password: password },
              },
            },
            tenant: {
              connect: {
                id: tenantId,
              },
            },
          },
          include: {
            account: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });
      }),
    );

    res.forEach(async ({ id, accessLevel, account: user }) => {
      const insertAlumniQuery = `
        INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, $5::"template"."AccessLevel", 'APPROVED')
      `;
      await mainAppPrisma.$executeRawUnsafe(
        insertAlumniQuery,
        id,
        tenant.id,
        user.id,
        user.email,
        accessLevel,
      );
    });

    return res;

    // let user = await prisma.account.findUnique({
    //   where: { email: email },
    // });

    // if (!user) {
    //   user = await prisma.account.create({
    //     data: {
    //       email: email,
    //       password: encryptedPassword,
    //     },
    //   });
    // }

    // const member = await prisma.alumni.findUnique({
    //   where: {
    //     tenantId_accountId: {
    //       tenantId: tenantId,
    //       accountId: user.id,
    //     },
    //   },
    // });

    // if (member) {
    //   throw new Error('member already existed');
    // }

    // const newMember = await prisma.alumni.create({
    //   data: {
    //     accessLevel: accessLevel,
    //     account: {
    //       connect: {
    //         email: email,
    //       },
    //     },
    //     tenant: {
    //       connect: {
    //         id: tenantId,
    //       },
    //     },
    //   },
    // });

    // const insertAlumniQuery = `
    //   INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, $5::"template"."AccessLevel", 'APPROVED')
    // `;
    // await mainAppPrisma.$executeRawUnsafe(
    //   insertAlumniQuery,
    //   newMember.id,
    //   tenant.id,
    //   user.id,
    //   user.email,
    //   accessLevel,
    // );

    // return newMember;
  };

  static externalCreate = async ({
    tenantId,
    ...memberData
  }: ExternalCreateMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    if (!memberData.fullName || memberData?.gradeClass?.length === 0) {
      throw new Error('invalid data');
    }

    let account = {};

    if (memberData.email) {
      account = await prisma.account.findUnique({
        where: { email: memberData.email },
      });

      const randomPassword = Math.random().toString(36).slice(-8);
      const encryptedRandomPassword = hashSync(randomPassword, 10);

      if (!account) {
        account = await prisma.account.create({
          data: {
            email: memberData.email,
            password: encryptedRandomPassword,
          },
        });
      }
    }

    const member = await prisma.alumni.findUnique({
      where: {
        tenantId_accountId: {
          tenantId: tenantId,
          accountId: user.id,
        },
      },
    });

    if (member) {
      throw new Error('member already existed');
    }

    const newMember = await prisma.alumni.create({
      data: {
        accessLevel: 'ALUMNI',
        account: {
          connect: {
            email: email,
          },
        },
        tenant: {
          connect: {
            id: tenantId,
          },
        },
      },
    });

    const insertAlumniQuery = `
      INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, 'ALUMNI', 'PENDING')
    `;
    await mainAppPrisma.$executeRawUnsafe(
      insertAlumniQuery,
      newMember.id,
      tenant.id,
      user.id,
      user.email,
    );

    return newMember;
  };

  static getList = async ({ tenantId, params }: GetMemberListServiceProps) => {
    await isTenantExisted(tenantId);

    const { email, page, limit } = params;

    const whereFilter = {
      AND: [
        { tenantId: tenantId },
        {
          account: {
            email: {
              contains: email,
            },
          },
        },
        { archived: false },
      ],
    };

    const [totalMemberItem, MemberItems] = await prisma.$transaction([
      prisma.alumni.count({
        where: whereFilter,
      }),
      prisma.alumni.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereFilter,
        include: {
          account: true,
        },
      }),
    ]);

    return {
      totalItems: totalMemberItem,
      items: MemberItems,
      itemPerPage: limit,
    };
  };

  // static getById = async (id: string) => {
  //   const grade = await prisma.Member.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   return grade;
  // };

  static updateInfoById = async (
    id: string,
    data: UpdateMemberInfoByIdServiceProps,
  ) => {
    let member = await prisma.alumni.findUnique({
      where: {
        id: id,
      },
      include: {
        tenant: true,
      },
    });

    if (data.password) {
      const encryptedPassword = hashSync(data.password, 10);

      await prisma.account.update({
        where: {
          id: member?.accountId,
        },
        data: {
          password: encryptedPassword,
        },
      });
    }

    if (data.accessLevel) {
      if (
        member?.accessLevel === 'SCHOOL_ADMIN' ||
        data.accessLevel === 'SCHOOL_ADMIN'
      ) {
        return member;
      }

      member = await prisma.alumni.update({
        where: {
          id: id,
        },
        data: {
          accessLevel: data.accessLevel,
        },
        include: {
          tenant: true,
        },
      });

      const alumniQuery = `
        UPDATE ${member?.tenant.tenantId}.alumni SET access_level = $1::"template"."AccessLevel" WHERE id = $2;
      `;
      await mainAppPrisma.$executeRawUnsafe(alumniQuery, data.accessLevel, id);
    }

    return member;
  };

  static deleteById = async (id: string) => {
    const member = await prisma.alumni.findUnique({
      where: { id: id },
      include: {
        tenant: true,
      },
    });

    if (member?.isOwner) {
      throw new Error('cannot delete');
    }

    const memberDeleted = await prisma.alumni.delete({
      where: {
        id: id,
      },
    });

    const alumniQuery = `
      DELETE FROM ${member?.tenant.tenantId}.alumni WHERE id = $1;
    `;
    await mainAppPrisma.$executeRawUnsafe(alumniQuery, id);

    return memberDeleted;
  };
}
