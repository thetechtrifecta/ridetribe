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

        // Fetch events based on the numeric creatorId that matches pgUser.id and include rides
        const events = await prisma.event.findMany({
            where: { creatorId: pgUser.id },
            include: {
                rides: {
                    include: {
                        kids: true,  // Include 'kids' relationship in each ride
                        creator: true // Optionally include ride creator information if needed
                    }
                }
            }
        });

        return NextResponse.json(events, { status: 200 }); // Directly send the array of events
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ message: 'Internal Server Error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
    }
}
