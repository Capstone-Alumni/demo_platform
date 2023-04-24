import { prisma } from '@lib/prisma/prisma';

import { GetTransactionListServiceProps } from '../types';

export default class TransactionService {
  static getList = async ({ params }: GetTransactionListServiceProps) => {
    const { tenantName, page, limit } = params;

    const whereFilter = {
      tenant: {
        name: {
          contains: tenantName,
        },
      },
    };

    const [totalTenantItem, TenantItems] = await prisma.$transaction([
      prisma.transaction.count({
        where: whereFilter,
      }),
      prisma.transaction.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereFilter,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      totalItems: totalTenantItem,
      items: TenantItems,
      itemPerPage: limit,
    };
  };
}
