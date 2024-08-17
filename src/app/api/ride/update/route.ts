import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { eventTitle } = await req.json();
        // const { rideId, eventTitle } = await req.json();

        // Check if the ride exists and fetch its details
        const ride = await prisma.ride.findUnique({
            where: {
                id: 3
                // id: rideId  // Assuming rideId is passed in the request body
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

        // Update the ride with the new title
        const updatedRide = await prisma.ride.update({
            where: {
                id: 3
                // id: rideId
            },
            data: {
                title: eventTitle
            }
        });

        return new NextResponse(JSON.stringify(updatedRide), {
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
