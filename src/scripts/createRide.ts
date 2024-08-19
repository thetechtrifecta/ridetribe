import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createUserRide() {
  // First, fetch the user by email to get the ID
  const user = await prisma.user.get({
    where: {
      email: 'elsa@prisma.io'
    }
  });

  if (!user) {
    console.log('User not found!');
    return;
  }

  // Now create a ride for this user
  const ride = await prisma.ride.create({
    data: {
      title: 'Magical Mountain Adventure',
      creatorId: user.id
    }
  });

  console.log(ride);
}

createUserRide()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });