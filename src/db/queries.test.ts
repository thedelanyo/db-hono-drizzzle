import { describe, it, expect } from "bun:test";
import { addTodo, getTodosByUserId, Todo } from "./queries";

describe("addTodo", () => {
  it("should add a todo into the db", async () => {
    const newTodo: Todo = {
      userId: "741bdbe4-283a-4ef7-f4c6-e35b416c8fc8",
      title: "Test todo",
      description: "Test todo",
    };

    const todo = await addTodo(newTodo);

    expect(todo.id).toBeDefined();
    expect(todo.userId).toBe(newTodo.userId);
  });
});
