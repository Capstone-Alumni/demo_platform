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
}
