import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'; 

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const auth = getAuth(req);
  
  if (!auth.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { clerkUserId, email, firstName, lastName, phone } = await req.json();

  try {
    const user = await prisma.user.upsert({
      where: { clerkUserId },
      update: {}, 
      create: {
        clerkUserId,
        email,
        firstName,
        lastName,
        phone,
      },
    });
    return NextResponse.json({ message: 'User synchronized successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Failed to sync user:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to synchronize user', detail: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to synchronize user', detail: 'An unknown error occurred' }, { status: 500 });
    }
  }
};
