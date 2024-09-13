import * as React from 'react';
import Typography from '@mui/material/Typography';
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import UserDisplay from './UserDisplay';
import RidesList from './RidesList';
const prisma = new PrismaClient();

export default async function UserSessionInfo() {
  const clerkUser = await currentUser()
  if (!clerkUser) return

  const pgUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id}
  })

  const rides = await prisma.ride.findMany({
    where: { creatorId: pgUser?.id },
  })

  return (
    <>
      <UserDisplay pgUser={pgUser} />
      <RidesList rides={rides} />
    </>
  );
}
