import { Hono } from "hono";
import { uploadRoute } from "./routes/upload";

export const app = new Hono();

app.get("/", (c) => {
  return c.text("in construction...");
});

app.route("/upload", uploadRoute);
