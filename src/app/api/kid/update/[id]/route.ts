import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const kidId = req.nextUrl.pathname.split('/').pop();
        const { firstName, lastName, age, phone } = await req.json();

        const parsedAge = parseInt(age, 10);
        if (isNaN(parsedAge)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid age provided!' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const updatedKid = await prisma.kid.update({
            where: { id: parseInt(kidId || '0') }, 
            data: {
                firstName,
                lastName,
                age: parsedAge,
                phone
            }
        });

        return new NextResponse(JSON.stringify(updatedKid), {
            status: 200,
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
