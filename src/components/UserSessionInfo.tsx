import * as React from 'react';
import Typography from '@mui/material/Typography';
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function UserSessionInfo() {
  const user = await currentUser()
  console.log('user:', user)
  if (!user) return

  const rides = await prisma.ride.findMany({
    where: { creatorId: 1 },
  })

  return (
    <>
      <Typography>
        Hello {user?.firstName} with clerkUserId {user?.id} and primary email {user?.primaryEmailAddress?.emailAddress}
      </Typography>
      <Typography>
        {JSON.stringify(rides, null)}
      </Typography>
    </>
  );
}
