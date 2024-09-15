import * as React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import UserDisplay from './UserDisplay';
const prisma = new PrismaClient();

export default async function UserSessionInfo() {
  const clerkUser = await currentUser()
  if (!clerkUser) return

  const pgUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id}
  })

  return (
    <>
      <UserDisplay pgUser={pgUser} />
    </>
  );
}
