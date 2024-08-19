import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      clerkUserId: 'user_fakeUser1234IDinClerk',
      email: 'example@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+11234567890'
    },
  });
  console.log(user);
}

main()