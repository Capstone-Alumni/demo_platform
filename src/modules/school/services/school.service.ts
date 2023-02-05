import { prisma } from '@lib/prisma/prisma';

export default class SchoolService {
  static getSchool = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        members: {
          where: {
            accessLevel: 'SCHOOL_ADMIN',
          },
          include: {
            tenant: true,
          },
        },
      },
    });

    return user?.members[0].tenant;
  };
}
