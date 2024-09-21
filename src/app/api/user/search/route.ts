import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {

    const query = req.nextUrl.searchParams.get('query');
    if (!query) {
        return new NextResponse(JSON.stringify({ error: 'Query parameter is required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

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

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { startsWith: query, mode: 'insensitive' } },
                ],
                NOT: {
                    id: pgUser.id // Exclude the current user from search results
                }
            },
            select: { id: true, firstName: true, lastName: true }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName.charAt(0)}.`
        }));

        return new NextResponse(JSON.stringify(formattedUsers), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Search users failed:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error', details: error instanceof Error ? error.message : 'An unexpected error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
