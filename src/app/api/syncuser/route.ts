import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser(); 

    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const upsertUser = await prisma.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'Unknown',
        phone: user.primaryPhoneNumber?.phoneNumber || 'Not Provided',
      },
      create: {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'Unknown',
        phone: user.primaryPhoneNumber?.phoneNumber || 'Not Provided',
      },
    });

    return NextResponse.json({ message: 'User synchronized successfully', details: upsertUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
