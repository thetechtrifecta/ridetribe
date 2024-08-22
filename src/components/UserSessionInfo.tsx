import * as React from 'react';
import Typography from '@mui/material/Typography';
import { currentUser } from "@clerk/nextjs/server";
import CreateRide from './CreateRide';
import { PrismaClient } from '@prisma/client';
import UpdateRide from './UpdateRide';
import DeleteRide from './DeleteRide';
import CreateKid from './CreateKid';
const prisma = new PrismaClient();
import CreateRideAll from './CreateRideAll';

export default async function UserSessionInfo() {
  const user = await currentUser()
  if (!user) return
  
  // Synchronize the user with the database
  try {
    const upsertUser = await prisma.user.upsert({
      where: { clerkUserId: user.id },
      update: {}, // No updates if user exists
      create: {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'Unknown',
        phone: user.primaryPhoneNumber?.phoneNumber || 'Not Provided',
      },
    });
    console.log('User synchronized successfully:', upsertUser);
  } catch (error) {
    console.error('Error syncing user:', error);
  }

  // const ride = await prisma.ride.findFirst({
  //   where: { creatorId: 1 },
  // })

  return (
    <>
      {/* <Typography>
        Hello {user?.firstName} with clerkUserId {user?.id} and primary email {user?.primaryEmailAddress?.emailAddress}
      </Typography> */}
      {/* <CreateRide />
      <Typography>
        {JSON.stringify(ride, null)}
      </Typography>
      <UpdateRide />
      <DeleteRide />
      <CreateKid /> */}
      <CreateRideAll />
    </>
  );
}
