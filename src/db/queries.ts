// db.select().from(todos).limit(10);

import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { todosTable as table, usersTable } from "./schema";
import { UUID } from "crypto";

export type Todo = {
  userId: string;
  title: string;
  description?: string;
  completed?: boolean;
};

export const addTodo = async (todo: Todo) => {
  const [data] = await db.insert(table).values(todo).returning();

  return data;
};

export const getTodosByUserId = async (userId: string) => {
  const todos = await db
    .select()
    .from(table)
    .where(eq(table.userId, userId))
    .orderBy(desc(table.createdAt));

  return todos;
};

export const createUser = async (email: string, password: string) => {
  const passwordHash = await Bun.password.hash(password);
  const age = Math.floor(Math.random() * (120 - 13 + 1)) + 13;

  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, age })
    .returning();

  return user.id as UUID;
};
