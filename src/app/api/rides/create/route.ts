import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  const { eventTitle } = await req.json();
  
  try {
    const result = await sql`
      INSERT INTO rides (event_title)
      VALUES (${eventTitle})
      RETURNING id
    `;
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating ride'}, { status: 500 });
  }
}
