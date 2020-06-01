import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import DB from "./DB.ts";
import { PostPost, getAllPosts, GetOnePost, DeletePost } from "./posts.route.ts";
import { GetAllUsers, GetOneUser, GetOneUserPosts, PostUser, DeleteUser } from "./users.route.ts";

const app = new Application();
const router = new Router();

export interface RequestError extends Error {
  status: number;
}

let idUser = v4.generate();
let idPost = v4.generate();

DB.users.set(idUser, { id: idUser, name: "Toto", photo: "Test de photo" });
DB.posts.set(idPost, { id: idPost, content: "Lorem Ipsum", title: "Super Post", userId: idUser });

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = err;
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      message: error.message,
    };
  }
});

router
  .get("/users", GetAllUsers)
  .get("/users/:id", GetOneUser)
  .get("/users/:id/posts", GetOneUserPosts)
  .post("/users", PostUser)
  .delete("/users/:id", DeleteUser);

router.get("/posts", getAllPosts).get("/posts/:id", GetOnePost).post("/posts", PostPost).delete("/posts/:id", DeletePost);

app.use(router.routes());

app.use((ctx) => {
  ctx.response.body = "hello World ! 🦕";
});

console.log("Server is listening...");

await app.listen({ port: 8000 });
