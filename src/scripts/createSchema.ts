import 'dotenv/config';
import { sql } from '@vercel/postgres';

const createSchema = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS rides (
      id SERIAL PRIMARY KEY,
      event_title TEXT NOT NULL
    )`;
    console.log('Schema creation successful.');
  } catch (error) {
    console.error('Error creating schema:', error);
  }
};

createSchema();
