import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { hashSync } from 'bcrypt';

import {
  CreateManyMemberServiceProps,
  CreateMemberServiceProps,
  ExternalCreateMemberServiceProps,
  GetMemberListServiceProps,
  UpdateMemberInfoByIdServiceProps,
} from '../types';
import axios from 'axios';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';

const isTenantExisted = async (id: string) => {
  if (!id) {
    throw new Error('tenant not exist');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: id },
  });

  if (!tenant) {
    throw new Error('tenant not exist');
  }

  return tenant;
};

export default class MemberService {
  static create = async ({
    email,
    password,
    accessLevel,
    tenantId,
  }: CreateMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    if (!email || !password) {
      throw new Error('invalid data');
    }

    let user = await prisma.account.findUnique({
      where: { email: email },
    });

    const encryptedPassword = hashSync(password, 10);

    if (!user) {
      user = await prisma.account.create({
        data: {
          email: email,
          password: encryptedPassword,
        },
      });
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
        accessLevel: accessLevel,
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
      INSERT INTO ${tenant.tenantId}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, $5::"template"."AccessLevel", 'APPROVED')
    `;
    await mainAppPrisma.$executeRawUnsafe(
      insertAlumniQuery,
      newMember.id,
      tenant.tenantId,
      user.id,
      user.email,
      accessLevel,
    );

    const host = getTenantHost(tenant.subdomain || '');

    // // run async
    axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
      to: user.email,
      subject: 'Mời thành viên',
      text: `
            Kính gửi anh/chị,
            
            ${tenant.name} mời bạn sử dụng hệ thống kết nối cựu sinh viên.
            Trang web: ${host}
            Tài khoản đăng nhập:
            - email: ${user.email}
            - password: ${password}
          `,
    });

    return newMember;
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
    email,
    password,
    tenantId,
  }: ExternalCreateMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    if (!email || !password) {
      throw new Error('invalid data');
    }

    let user = await prisma.account.findUnique({
      where: { email: email },
    });

    const encryptedPassword = hashSync(password, 10);

    if (!user) {
      user = await prisma.account.create({
        data: {
          email: email,
          password: encryptedPassword,
        },
      });
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
