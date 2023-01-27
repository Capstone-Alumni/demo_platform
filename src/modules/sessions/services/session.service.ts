import { compareSync } from 'bcrypt';
import { prisma } from '@lib/prisma/prisma';
import { SignInRequestBody } from '../types';

export default class SessionService {
  static signIn = async ({
    email,
    password: passwordInputted,
    subdomain,
  }: SignInRequestBody) => {
    if (!subdomain) {
      throw new Error('wrong tenant');
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        members: {
          include: {
            tenant: {
              select: {
                tenantId: true,
                subdomain: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('sign-in failed');
    }

    const tenant = user.members.find(m => m.tenant.subdomain === subdomain);

    if (!tenant) {
      throw new Error('wrong subdomain');
    }

    const { password } = user;

    if (password && compareSync(passwordInputted, password)) {
      return {
        id: user.id,
        email: user.email,
        tenant: {
          tenantId: tenant.tenant.tenantId,
          subdomain: tenant.tenant.subdomain,
        },
        accessLevel: tenant.accessLevel,
        accessStatus: tenant.accessStatus,
        accessMode: tenant.accessMode,
      };
    }

    throw new Error('sign-in failed');
  };

  static internalLogin = async ({
    email,
    password: passwordInputted,
  }: SignInRequestBody) => {
    console.log(email);
    console.log(passwordInputted);
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        members: {
          where: {
            accessLevel: 'SCHOOL_ADMIN',
          },
          include: {
            tenant: {
              select: {
                id: true,
                tenantId: true,
                subdomain: true,
              },
            },
          },
        },
      },
    });
    console.log(user);

    if (!user) {
      throw new Error('sign-in failed');
    }

    if (!user.isTenantAdmin && user?.members.length !== 1) {
      throw new Error('denied');
    }

    const { password } = user;

    if (password && compareSync(passwordInputted, password)) {
      return {
        id: user.id,
        email: user.email,
        isTenantAdmin: user.isTenantAdmin,
        tenant: user.members[0].tenant,
      };
    }

    throw new Error('sign-in failed');
  };
}
