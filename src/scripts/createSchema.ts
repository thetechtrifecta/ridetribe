import 'dotenv/config';
import { sql } from '@vercel/postgres';

const createSchema = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS rides (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      riders_kids_count INTEGER NOT NULL,
      riders_kids_names JSON NOT NULL, -- Using JSON data type if supported
      riders_kids_phone_numbers JSON, -- Optional, using JSON data type
      riders_kids_ages JSON NOT NULL, -- Using JSON data type
      riders_kids_pickup_dropoff JSON NOT NULL, -- Using JSON data type
      event_title TEXT NOT NULL,
      event_description TEXT NOT NULL,
      event_start_time TIMESTAMP NOT NULL,
      event_end_time TIMESTAMP NOT NULL,
      event_location TEXT NOT NULL,
      drive_status TEXT NOT NULL
    )`;
    console.log('Schema creation successful.');
  } catch (error) {
    console.error('Error creating schema:', error);
  }
};

createSchema();
