import { prisma } from '@lib/prisma/prisma';

export default class SchoolService {
  static getSchool = async (userId: string) => {
    const user = await prisma.account.findUnique({
      where: {
        id: userId,
      },
      include: {
        alumni: {
          where: {
            accessLevel: 'SCHOOL_ADMIN',
          },
          include: {
            tenant: true,
          },
        },
      },
    });

    return user?.alumni[0].tenant;
  };
}
