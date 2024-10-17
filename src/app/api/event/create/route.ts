import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { eventData } = await req.json();
        const { clerkUserId, title, address, startTime, endTime } = eventData;

        if (!clerkUserId || !title || !address || !startTime || !endTime) {
            return new NextResponse(JSON.stringify({ error: 'Missing required event data' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Fetch the user by clerkUserId to ensure they exist
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: clerkUserId
            }
        });

        if (!user) {
            return new NextResponse(JSON.stringify({ error: 'User not found!' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Create the event, linking it to the user
        const event = await prisma.event.create({
            data: {
                creatorId: user.id,  // Link the event to the authenticated user
                title,
                address,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            }
        });

        return new NextResponse(JSON.stringify(event), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error) {
        console.error('Error creating event:', error);
        return new NextResponse(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}
