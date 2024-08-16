import * as React from 'react';
import Typography from '@mui/material/Typography';
import { currentUser } from "@clerk/nextjs/server";
import CreateRide from './CreateRide';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function UserSessionInfo() {
  const user = await currentUser()
  if (!user) return
  const ride = await prisma.ride.findFirst({
    where: { creatorId: 1 },
  })

  return (
    <>
      <Typography>
        Hello {user?.firstName} with primary email {user?.primaryEmailAddress?.emailAddress}
      </Typography>
      <CreateRide />
      <Typography>
        {JSON.stringify(ride, null)}
      </Typography>
    </>
  );
}
