import { prisma } from 'src/lib/prisma/prisma';
import { exclude } from './helpers';
import { User } from '@prisma/client';

export const getAlums = async () => {
  try {
    const alumns = await prisma.user.findMany({
      where: {
        archived: false,
      },
    });
    const alumsResponse = alumns.map((alum: User) =>
      exclude(alum, ['password']),
    );
    return alumsResponse;
  } catch (error) {
    return error;
  }
};
