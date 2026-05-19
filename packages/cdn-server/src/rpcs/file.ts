import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { GetFilePresignedError } from "../lib/errors.ts";
import { getFilePresigned } from "../lib/s3.ts";
import { authed, pub } from "./auth-middleware.ts";

export const getFilePresignedRPC = pub
	.use(authed)
	.input(z.object({ key: z.string() }))
	.handler(async ({ input }) => {
		try {
			const url = await getFilePresigned(input.key);

			return { url };
		} catch (err) {
			if (err instanceof GetFilePresignedError) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: err.cause });
			}
		}
	});
