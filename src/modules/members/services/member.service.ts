import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { hashSync } from 'bcrypt';

import {
  CreateMemberServiceProps,
  GetMemberListServiceProps,
  UpdateMemberInfoByIdServiceProps,
} from '../types';

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
      tenant.id,
      user.id,
      user.email,
      accessLevel,
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
