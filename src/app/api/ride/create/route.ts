import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { eventTitle } = await req.json();
        // const { email, title } = await req.json();  // Assuming you pass the email and title in the request body

        // First, fetch the user by email to get the ID
        const user = await prisma.user.findUnique({
            where: {
                email: 'elsa@prisma.io'
                // email: email  // Use the email from the request
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

        // Now create a ride for this user
        const ride = await prisma.ride.create({
            data: {
                title: eventTitle,
                // title: title,  // Use the title from the request
                creatorId: user.id
            }
        });

        return new NextResponse(JSON.stringify(ride), {
            status: 201,  // HTTP status code 201 for Created
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
