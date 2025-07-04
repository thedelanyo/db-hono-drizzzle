import { randomUUIDv7 } from "bun";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "path";

export type TestDBContext = {
  pool: Pool;
  testDbName: string;
  db: NodePgDatabase<typeof schema>;
};

const adminDbUrl = process.env.ADMIN_DATABASE_URL!;

export async function createTestDb(): Promise<TestDBContext> {
  const testDbName = `test_db${randomUUIDv7().replace(/-/g, "")}`;
  const testDbUrl = `postgresql://user:password@localhost:5432/${testDbName}`;

  const adminPool = new Pool({ connectionString: adminDbUrl });
  await adminPool.query(`CREATE DATABASE "${testDbName}"`);
  await adminPool.end();

  const pool = new Pool({
    connectionString: testDbUrl,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const db = drizzle(pool, { schema, casing: "snake_case" });
  await migrate(db, { migrationsFolder: join(__dirname, "../db/drizzle") });

  return { pool, db, testDbName };
}

export async function destroyTestDb({ pool, testDbName }: TestDBContext) {
  await pool.end();

  const adminPool = new Pool({ connectionString: adminDbUrl });

  await adminPool.query(
    `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
      `,
    [testDbName]
  );
  await adminPool.query(`DROP DATABASE IF EXISTS "${testDbName}"`);
  await adminPool.end();
}
