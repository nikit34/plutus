import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = (await fs.readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows: applied } = await pool.query('SELECT version FROM schema_migrations');
  const appliedSet = new Set(applied.map((r) => r.version));

  for (const file of files) {
    const version = file.replace(/\.sql$/, '');
    if (appliedSet.has(version)) {
      console.log(`= ${version} (already applied)`);
      continue;
    }
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf-8');
    console.log(`→ applying ${version}`);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
      await client.query('COMMIT');
      console.log(`✓ ${version}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`✗ ${version} failed:`, err.message);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log('Migrations complete.');
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
