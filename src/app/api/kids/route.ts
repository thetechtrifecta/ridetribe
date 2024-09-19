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

        // Fetch kids based on the numeric creatorId that matches pgUser.id
        const kids = await prisma.kid.findMany({
            where: { creatorId: pgUser.id },
        });

        return NextResponse.json(kids, { status: 200 }); // Directly send the array of kids
    } catch (error) {
        console.error('Error fetching kids:', error);
        return NextResponse.json({ message: 'Internal Server Error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }, { status: 500 });
    }
}
