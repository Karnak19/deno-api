import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import DB from "./DB.ts";
import { RequestError } from "./index.ts";

const router = new Router();

router.get("/users/", (ctx) => {
  ctx.response.body = [...DB.users.values()];
});

router.get("/users/:id", (ctx) => {
  const { id } = ctx.params;
  if (id && DB.users.has(id)) {
    ctx.response.body = { ...DB.users.get(id) };
  } else {
    const error = new Error("Not found! 🦕") as RequestError;
    error.status = 404;
    throw error;
  }
});

router.get("/users/:id/posts", (ctx) => {
  const { id } = ctx.params;
  if (id && DB.users.has(id)) {
    ctx.response.body = [...DB.posts.values()].filter(({ userId }) => id === userId);
  } else {
    const error = new Error("Not found! 🦕") as RequestError;
    error.status = 404;
    throw error;
  }
});

router.post("/users", async (ctx) => {
  const body = await ctx.request.body();
  const { name, photo } = body.value;
  const user = { id: v4.generate(), name, photo };

  DB.users.set(user.id, user);
  ctx.response.body = user;
});

router.delete("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  if (id && DB.users.has(id)) {
    DB.users.delete(id);
    ctx.response.status = 204;
    ctx.response.body = 1;
  } else {
    const error = new Error("Not found! 🦕") as RequestError;
    error.status = 404;
    throw error;
  }
});

export default router;
