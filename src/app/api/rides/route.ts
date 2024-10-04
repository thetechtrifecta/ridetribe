import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {

        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const pgUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id }
        });

        if (!pgUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Fetch rides based on the numeric creatorId that matches pgUser.id and include kids
        const rides = await prisma.ride.findMany({
            where: { creatorId: pgUser.id },
            include: {
                kids: true // Include kids associated with each ride
            }
        });

        return NextResponse.json(rides, { status: 200 }); // Directly send the array of rides
    } catch (error) {
        console.error('Error fetching rides:', error);
        return NextResponse.json({ message: 'Internal Server Error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
    }
}
