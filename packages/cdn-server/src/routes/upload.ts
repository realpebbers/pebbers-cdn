import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { UploadError } from "../lib/errors";
import { uploadFile } from "../lib/s3";

export const uploadRoute = new Hono();
// TODO BOMBACLART LAMBDA

uploadRoute.post(
  "/",
  zValidator("form", z.object({ payload: z.file() }).required()),
  async (c) => {
    const body = c.req.valid("form");

    try {
      await uploadFile(body.payload.name, body.payload.stream(), "text/plain");
    } catch (err) {
      if (err instanceof UploadError) {
        return c.json({ message: err.message }, 501);
      }
    }

    return c.json({ message: "Success!" });
  },
);
