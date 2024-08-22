import { PrismaClient } from '@prisma/client';
import { withAuth } from '@clerk/clerk-sdk-node';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default withAuth(async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { clerkUserId, email, firstName, lastName, phone } = req.body;

    try {
        const user = await prisma.user.upsert({
            where: { clerkUserId },
            update: {}, 
            create: {
                clerkUserId,
                email,
                firstName,
                lastName,
                phone,
            },
        });
        res.status(200).json({ message: 'User synchronized successfully', user });
    } catch (error) {
        console.error('Failed to sync user:', error);
        // Type guard to check if the error is an instance of Error
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to synchronize user', detail: error.message });
        } else {
            // Handle cases where the error is not an Error object
            res.status(500).json({ error: 'Failed to synchronize user', detail: 'An unknown error occurred' });
        }
    }
});
