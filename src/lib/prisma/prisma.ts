// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  mainAppPrisma: PrismaClient;
  prismaClientMapper: { [key: string]: PrismaClient };
};

globalForPrisma.prismaClientMapper = {};

export const getPrismaClient = async (
  tenantId: string,
): Promise<PrismaClient> => {
  if (globalForPrisma.prismaClientMapper[tenantId]) {
    return globalForPrisma.prismaClientMapper[tenantId];
  }

  const newPrismaClient = await new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.MAINAPP_DATABASE_URL}?schema=${tenantId}`,
      },
    },
    log: ['query'],
  });
  await newPrismaClient.$disconnect();

  globalForPrisma.prismaClientMapper[tenantId] = newPrismaClient;

  return newPrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error'],
  });

export const mainAppPrisma =
  globalForPrisma.mainAppPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.MAINAPP_DATABASE_URL,
      },
    },
    log: ['query', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.mainAppPrisma = mainAppPrisma;
}
