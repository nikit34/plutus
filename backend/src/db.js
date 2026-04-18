import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const pool = new Pool({ connectionString: config.databaseUrl });

pool.on('error', (err) => {
  console.error('Unexpected Postgres error on idle client', err);
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
