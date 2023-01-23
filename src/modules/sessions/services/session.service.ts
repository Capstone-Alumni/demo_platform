import { compareSync } from 'bcrypt';
import { omit } from 'lodash';
import { prisma } from '@lib/prisma/prisma';
import { SignInRequestBody } from '../types';

export default class SessionService {
  static signIn = async ({
    email,
    password: passwordInputted,
  }: SignInRequestBody) => {
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

    const { password } = user;

    if (password && compareSync(passwordInputted, password)) {
      return omit(user, 'password');
    }

    throw new Error('sign-in failed');
  };
}
