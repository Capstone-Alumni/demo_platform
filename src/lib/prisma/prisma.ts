// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  mainappPrisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

export const mainappPrisma =
  globalForPrisma.mainappPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.MAINAPP_DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.mainappPrisma = mainappPrisma;
}
