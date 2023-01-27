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
    tenantId,
  }: CreateMemberServiceProps) => {
    await isTenantExisted(tenantId);

    if (!email || !password) {
      throw new Error('invalid data');
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const encryptedPassword = hashSync(password, 10);

    if (!user) {
      await prisma.user.create({
        data: {
          email: email,
          password: encryptedPassword,
        },
      });
    }

    const newMember = await prisma.member.create({
      data: {
        user: {
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

    return newMember;
  };

  static getList = async ({ tenantId, params }: GetMemberListServiceProps) => {
    await isTenantExisted(tenantId);

    const { email, page, limit } = params;

    const whereFilter = {
      AND: [
        { tenantId: tenantId },
        {
          user: {
            email: {
              contains: email,
            },
          },
        },
        { archived: false },
      ],
    };

    const [totalMemberItem, MemberItems] = await prisma.$transaction([
      prisma.member.count({
        where: whereFilter,
      }),
      prisma.member.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereFilter,
        include: {
          user: true,
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
    const member = await prisma.member.findUnique({
      where: {
        id: id,
      },
    });

    if (data.password) {
      const encryptedPassword = hashSync(data.password, 10);

      await prisma.user.update({
        where: {
          id: member?.userId,
        },
        data: {
          password: encryptedPassword,
        },
      });
    }

    return member;
  };

  static deleteById = async (id: string) => {
    const MemberDeleted = await prisma.member.delete({
      where: {
        id: id,
      },
    });

    return MemberDeleted;
  };
}
