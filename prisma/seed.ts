/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.plan.create({
      data: {
        name: '3-month',
        duration: 90,
        price: 3000000,
      },
    }),
    prisma.plan.create({
      data: {
        name: '6-month',
        duration: 180,
        price: 5000000,
      },
    }),
    prisma.plan.create({
      data: {
        name: '1-year',
        duration: 365,
        price: 8000000,
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
