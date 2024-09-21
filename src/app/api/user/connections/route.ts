import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const pgUser = await prisma.user.findUnique({
            where: { clerkUserId: clerkUser.id }
        });

        if (!pgUser) {
            return new NextResponse(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Only fetch connections that this user has added
        const connections = await prisma.user.findMany({
            where: {
                connectedWith: {
                    some: { id: pgUser.id }
                }
            },
            select: { id: true, firstName: true, lastName: true }
        });

        return new NextResponse(JSON.stringify(connections), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching connections:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
