import { randomUUIDv7 } from "bun";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "path";

const adminDbUrl = process.env.ADMIN_DATABASE_URL!;

export async function createTestDb() {
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
