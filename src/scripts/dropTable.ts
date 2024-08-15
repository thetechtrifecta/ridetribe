import 'dotenv/config'
import { sql } from '@vercel/postgres';

async function dropTable() {
  try {
    await sql`
      DROP TABLE IF EXISTS rides;
    `;
    console.log('Table "rides" dropped successfully');
  } catch (error) {
    console.error('Error dropping table:', error);
  }
}

dropTable();
