import { Hono } from "hono";
import { uploadRoute } from "./routes/upload";

export const app = new Hono();

app.route("/upload", uploadRoute);
