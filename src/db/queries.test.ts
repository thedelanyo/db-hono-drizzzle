import { describe, it, expect } from "bun:test";
import { beforeEach, afterEach, mock } from "bun:test";
import { addTodo, createUser, getTodosByUserId, Todo } from "./queries";
import { createTestDb, destroyTestDb, TestDBContext } from "../test/setup.test";

let ctx: TestDBContext;

beforeEach(async () => {
  ctx = await createTestDb();

  await mock.module("../db/db.ts", () => ({ db: ctx.db }));
});

afterEach(async () => {
  await destroyTestDb(ctx);
});

describe("addTodo", () => {
  it("should add a todo into the db", async () => {
    const userId = await createUser("test@test.com", "password#1234");
    const newTodo: Todo = {
      userId,
      title: "Test Todo",
      description: "This is a test todo item",
    };

    const todo = await addTodo(newTodo);

    expect(todo.id).toBeDefined();
    expect(todo.userId).toBe(newTodo.userId);
  });
});
