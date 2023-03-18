import { prisma } from '@lib/prisma/prisma';

export default class SchoolService {
  static getSchool = async (subdomain: string, userId: string) => {
    const school = await prisma.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
      include: {
        alumni: {
          where: {
            accountId: userId,
          },
        },
      },
    });

    if (school?.alumni?.length !== 1) {
      throw new Error('school not existed');
    }

    return school;
  };
}
