import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Parse the request body to get the rideId
    const { rideId } = await req.json();
    try {
        // Find the ride with ID 2 to ensure it exists before attempting to delete it
        const ride = await prisma.ride.findUnique({
            where: {
                id: rideId // Use dynamic ride ID from the request
            }
        });

        if (!ride) {
            return new NextResponse(JSON.stringify({ error: 'Ride not found!' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Proceed to delete the ride
        const deletedRide = await prisma.ride.delete({
            where: {
                id: rideId // Use dynamic ride ID for deletion
            }
        });

        // Return a successful deletion response
        return new NextResponse(JSON.stringify(deletedRide), {
            status: 200,  // HTTP status code 200 for OK
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error: unknown) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } else {
            // Handle non-Error objects thrown
            return new NextResponse(JSON.stringify({ error: 'An unknown error occurred' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }
    }
}
