import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {

    const { userId } = await req.json();

    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'User ID is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        // Authenticate and get the current user's information using Clerk
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Find the Prisma user associated with the Clerk user
        const pgUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id }
        });

        if (!pgUser) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Connect the users
        await prisma.user.update({
            where: { id: pgUser.id },
            data: {
                connections: {
                    connect: { id: parseInt(userId) },
                },
            },
        });

        return new NextResponse(JSON.stringify({ message: 'Connection added successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error adding connection:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
