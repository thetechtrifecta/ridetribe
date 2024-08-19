import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createUserRide() {
  // First, fetch the user by email to get the ID
  const user = await prisma.user.findUnique({
    where: {
        clerkUserId: 'user_fakeUser4563IDinClerk'
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
      pickupAddress: "100 Main St, ZooTown",
      pickupTime: new Date("2023-10-10T09:00:00Z"),
      dropoffAddress: "101 Main St, HomeTown",
      dropoffTime: new Date("2023-10-10T15:00:00Z"),
      wouldDrive: true,
      seatsOffered: 3,
      wantRide: false,
      seatsNeeded: 0,
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