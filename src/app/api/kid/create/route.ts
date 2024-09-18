import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { clerkUserId, firstName, lastName, age, phone } = await req.json();

        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid age provided!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

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

        const kid = await prisma.kid.create({
            data: {
                creatorId: user.id,
                firstName,
                lastName,
                age: parsedAge,
                phone
            }
        });

        return new NextResponse(JSON.stringify(kid), {
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
