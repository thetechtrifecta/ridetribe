import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'elsa@prisma.io',
    },
  });
  console.log(user);
}

main()