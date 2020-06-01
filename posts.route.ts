import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";
import DB from "./DB.ts";
import { RequestError } from "./index.ts";

const router = new Router();

router.get("/posts", (ctx) => {
  ctx.response.body = [...DB.posts.values()];
});

router.get("/posts/:id", (ctx) => {
  const { id } = ctx.params;
  if (id && DB.posts.has(id)) {
    ctx.response.body = { ...DB.posts.get(id) };
  } else {
    const error = new Error("Not found! 🦕") as RequestError;
    error.status = 404;
    throw error;
  }
});

router.post("/posts", async (ctx) => {
  const body = await ctx.request.body();
  const { title, content, userId } = body.value;
  const post = { id: v4.generate(), title, content, userId };

  DB.posts.set(post.id, post);
  ctx.response.body = post;
});

router.delete("/posts/:id", async (ctx) => {
  const { id } = ctx.params;
  if (id && DB.posts.has(id)) {
    DB.posts.delete(id);
    ctx.response.status = 204;
    ctx.response.body = 1;
  } else {
    const error = new Error("Not found! 🦕") as RequestError;
    error.status = 404;
    throw error;
  }
});

export default router;
