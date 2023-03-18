import { prisma } from 'src/lib/prisma/prisma';
import { exclude } from './helpers';

export const getAlums = async () => {
  try {
    const alumns = await prisma.account.findMany({
      where: {
        archived: false,
      },
    });
    const alumsResponse = alumns.map((alum: any) =>
      exclude(alum, ['password']),
    );
    return alumsResponse;
  } catch (error) {
    return error;
  }
};
