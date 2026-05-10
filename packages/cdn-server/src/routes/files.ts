import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

export const filesRoute = new Hono();

filesRoute.get("/", zValidator("json", z.object()), (c) => {
  return c.json({});
});
