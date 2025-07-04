// db.select().from(todos).limit(10);

import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { todosTable as table } from "./schema";

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
