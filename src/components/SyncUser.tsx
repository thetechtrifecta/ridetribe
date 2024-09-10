import * as React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function SyncUser() {
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

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>[User Synced]</div>
  );
}
