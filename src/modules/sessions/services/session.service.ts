import { compareSync, hashSync } from 'bcrypt';
import { prisma } from '@lib/prisma/prisma';
import { SignInRequestBody, UpdatePasswordRequestBody } from '../types';

export default class SessionService {
  static signIn = async ({
    email,
    password: passwordInputted,
    subdomain,
  }: SignInRequestBody) => {
    if (!subdomain) {
      throw new Error('wrong tenant');
    }

    const account = await prisma.account.findUnique({
      where: { email: email },
      include: {
        alumni: {
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

    if (!account) {
      throw new Error('sign-in failed');
    }

    const alumni = account.alumni.find((m) => m.tenant.subdomain === subdomain);

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    const { password } = account;

    if (password && compareSync(passwordInputted, password)) {
      await prisma.alumni.update({
        where: {
          id: alumni.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      return {
        id: account.id,
        email: account.email,
        tenant: {
          tenantId: alumni.tenant.tenantId,
          subdomain: alumni.tenant.subdomain,
        },
        accessLevel: alumni.accessLevel,
      };
    }

    throw new Error('sign-in failed');
  };

  static internalLogin = async ({
    email,
    password: passwordInputted,
  }: SignInRequestBody) => {
    const account = await prisma.account.findUnique({
      where: { email: email },
      // include: {
      //   alumni: {
      //     where: {
      //       accessLevel: 'SCHOOL_ADMIN',
      //     },
      //   },
      // },
    });

    if (!account) {
      throw new Error('sign-in failed');
    }

    if (!account.isTenantAdmin) {
      throw new Error('denied');
    }

    const { password } = account;

    if (password && compareSync(passwordInputted, password)) {
      return {
        id: account.id,
        email: account.email,
        isTenantAdmin: account.isTenantAdmin,
      };
    }

    throw new Error('sign-in failed');
  };

  static updatePassword = async ({
    userId,
    password: currentPassword,
    newPassword,
    subdomain,
  }: UpdatePasswordRequestBody) => {
    if (!subdomain) {
      throw new Error('wrong tenant');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      throw new Error('update-password failed');
    }

    const tenant = user.members.find((m) => m.tenant.subdomain === subdomain);

    if (!tenant) {
      throw new Error('wrong subdomain');
    }

    const { password } = user;

    if (password && compareSync(currentPassword, password)) {
      if (currentPassword === newPassword) {
        throw new Error('same-password');
      }
      const hashedPassword = hashSync(newPassword, 10);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

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

    throw new Error('Sai mật khẩu, vui lòng thử lại.');
  };
}
