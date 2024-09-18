import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Parse the request body to get the kidId
    const { kidId } = await req.json();
    try {
        // Find the kid to ensure it exists before attempting to delete it
        const kid = await prisma.kid.findUnique({
            where: {
                id: kidId // Use dynamic kid ID from the request
            }
        });

        if (!kid) {
            return new NextResponse(JSON.stringify({ error: 'Kid not found!' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        // Proceed to delete the kid
        const deletedKid = await prisma.kid.delete({
            where: {
                id: kidId // Use dynamic kid ID for deletion
            }
        });

        // Return a successful deletion response
        return new NextResponse(JSON.stringify(deletedKid), {
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
