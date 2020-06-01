import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import DB from "./DB.ts";
import users from "./users.route.ts";
import posts from "./posts.route.ts";

const app = new Application();

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

app.use(users.routes());
app.use(posts.routes());

app.use((ctx) => {
  ctx.response.body = "hello World ! 🦕";
});

console.log("Server is listening...");

await app.listen({ port: 8000 });
