import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { connectionId } = await req.json();  // ID of the user to disconnect from

    try {
        // First, get the currently authenticated user
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

        // Disconnect the specified user connection
        await prisma.user.update({
            where: { id: pgUser.id },
            data: {
                connections: {
                    disconnect: [{ id: connectionId }]
                }
            }
        });

        return new NextResponse(JSON.stringify({ message: 'Connection removed successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        // Check if the error is an instance of Error
        if (error instanceof Error) {
            return new NextResponse(JSON.stringify({
                error: 'Failed to delete connection',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            // Handle cases where the error might not be an Error object
            return new NextResponse(JSON.stringify({
                error: 'Failed to delete connection',
                details: 'An unexpected error occurred'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
}
