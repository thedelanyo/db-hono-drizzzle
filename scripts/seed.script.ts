import { db, pool } from "../src/db/db";
import * as schema from "../src/db/schema";
import { seed } from "drizzle-seed";

export const seedDb = async () => {
  await seed(db, schema).refine((funcs) => ({
    usersTable: {
      columns: {},
      count: 20,
      with: { todosTable: 20 },
    },
  }));
};
