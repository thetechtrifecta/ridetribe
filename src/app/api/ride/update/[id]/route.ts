import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.pathname.split('/').pop();
        const { rideType, pickupAddress, dropoffAddress, wouldDrive, seatsOffered, wantRide, seatsNeeded, kids } = await req.json();

        const updatedRide = await prisma.ride.update({
            where: { id: parseInt(id || '0') },
            data: {
                rideType,
                pickupAddress,
                dropoffAddress,
                seatsOffered: parseInt(seatsOffered),
                seatsNeeded: parseInt(seatsNeeded),
                wouldDrive,
                wantRide,
                kids: {
                    set: kids.map((kidId: number) => ({ id: kidId }))
                }
            }
        });

        return new NextResponse(JSON.stringify(updatedRide), {
            status: 200,
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
