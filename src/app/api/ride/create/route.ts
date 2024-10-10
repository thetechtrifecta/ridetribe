import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { rideData } = await req.json();

        console.log('Received rideData:', rideData); // Logging the received data

        // Extract the clerkUserId and validate the rest of the ride data
        const { clerkUserId, eventTitle, description, pickupAddress, dropoffAddress, rideType, pickupTime, dropoffTime, wouldDrive, seatsOffered, wantRide, seatsNeeded, kids } = rideData;

        // Validate all necessary fields based on rideType
        if (!clerkUserId || !eventTitle || !pickupAddress || !dropoffAddress || !rideType || wouldDrive === undefined || seatsOffered === undefined || wantRide === undefined || seatsNeeded === undefined || !Array.isArray(kids) ||
            (rideType === 'to' && !dropoffTime) || (rideType === 'from' && !pickupTime)) {
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

        // Create the ride, linking it to the user and associating the kids
        const ride = await prisma.ride.create({
            data: {
                title: eventTitle,
                description: description,
                pickupAddress: pickupAddress,
                dropoffAddress: dropoffAddress,
                pickupTime: rideType === 'from' ? new Date(pickupTime) : null,
                dropoffTime: rideType === 'to' ? new Date(dropoffTime) : null,
                rideType,
                wouldDrive: wouldDrive,
                seatsOffered: seatsOffered,
                wantRide: wantRide,
                seatsNeeded: seatsNeeded,
                creatorId: user.id,  // Use the verified user's ID

                // Associate the kids with the ride using the `connect` field
                kids: {
                    connect: kids.map((kidId: number) => ({ id: kidId }))
                }
            },
            include: {
                kids: true  // Optionally include the kids in the response
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
