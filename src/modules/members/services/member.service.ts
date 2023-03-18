import { prisma } from '@lib/prisma/prisma';
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
};

export default class MemberService {
  static create = async ({
    email,
    password,
    accessLevel,
    tenantId,
  }: CreateMemberServiceProps) => {
    await isTenantExisted(tenantId);

    if (!email || !password) {
      throw new Error('invalid data');
    }

    const user = await prisma.account.findUnique({
      where: { email: email },
    });

    const encryptedPassword = hashSync(password, 10);

    if (!user) {
      await prisma.account.create({
        data: {
          email: email,
          password: encryptedPassword,
        },
      });
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

    console.log(accessLevel, newMember);

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
    const member = await prisma.alumni.findUnique({
      where: {
        id: id,
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
      if (data.accessLevel === 'ALUMNI') {
        await prisma.alumni.update({
          where: {
            id: id,
          },
          data: {
            accessLevel: data.accessLevel,
          },
        });
      } else {
        await prisma.alumni.update({
          where: {
            id: id,
          },
          data: {
            accessLevel: data.accessLevel,
          },
        });
      }
    }

    return member;
  };

  static deleteById = async (id: string) => {
    const MemberDeleted = await prisma.alumni.delete({
      where: {
        id: id,
      },
    });

    return MemberDeleted;
  };
}
