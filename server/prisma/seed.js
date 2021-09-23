import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import faker from 'faker';

const prisma = new PrismaClient();

const users = Array.from(Array(2).keys()).map((i) => ({
  username: faker.lorem.words(1),
  password: faker.lorem.words(1),
}));

async function main() {
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
