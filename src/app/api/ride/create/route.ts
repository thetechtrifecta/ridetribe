import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { rideData } = await req.json();

        console.log('Received rideData:', rideData); // Logging the received data

        // Extract the clerkUserId and validate the rest of the ride data
        const { clerkUserId, eventTitle, description, pickupAddress, pickupTime, dropoffAddress, dropoffTime, wouldDrive, seatsOffered, wantRide, seatsNeeded } = rideData;
        if (!clerkUserId || !eventTitle || !description || !pickupAddress || !pickupTime || !dropoffAddress || !dropoffTime || wouldDrive === undefined || seatsOffered === undefined || wantRide === undefined || seatsNeeded === undefined) {
            return new NextResponse(JSON.stringify({ error: 'Missing required ride data' }), {
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

        // Create a ride with the provided data, linking it to the verified user
        const ride = await prisma.ride.create({
            data: {
                title: eventTitle,
                description: description,
                pickupAddress: pickupAddress,
                pickupTime: new Date(pickupTime),
                dropoffAddress: dropoffAddress,
                dropoffTime: new Date(dropoffTime),
                wouldDrive: wouldDrive,
                seatsOffered: seatsOffered,
                wantRide: wantRide,
                seatsNeeded: seatsNeeded,
                creatorId: user.id // Use verified user's ID
            }
        });

        return new NextResponse(JSON.stringify(ride), {
            status: 201,  // HTTP status code 201 for Created
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else {
            return new NextResponse(JSON.stringify({ error: 'An unknown error occurred' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    }
}