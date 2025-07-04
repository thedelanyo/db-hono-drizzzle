import { Hono } from "hono";
import { getTodosByUserId } from "./db/queries";

const app = new Hono();

app.get("/todos", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ error: "no user id provided" }, 400);
  }

  try {
    const todos = await getTodosByUserId(userId);

    return c.json(todos, 200);
  } catch (e) {
    console.log(e);

    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
