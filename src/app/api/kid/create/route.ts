import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { clerkUserId, kidAge } = await req.json();

        const age = parseInt(kidAge, 10);
        if (isNaN(age)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid age provided!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // First, fetch the user by email to get the ID
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

        // Now create a kid for this user
        const kid = await prisma.kid.create({
            data: {
                firstName: 'Jimmeny',
                lastName: 'Cricket',
                age: age,
                creatorId: user.id
            }
        });

        return new NextResponse(JSON.stringify(kid), {
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
