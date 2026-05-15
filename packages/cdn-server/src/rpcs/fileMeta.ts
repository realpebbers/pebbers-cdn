import { ORPCError, os } from "@orpc/server";
import { z } from "zod";
import { GetFilePresignedError } from "../lib/errors.ts";
import { getFileMeta } from "../lib/s3.ts";

export const getFileMetaRPC = os
	.input(z.object({ key: z.string() }))
	.handler(async ({ input }) => {
		try {
			return await getFileMeta(input.key);
		} catch (err) {
			if (err instanceof GetFilePresignedError) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: err.cause });
			}
		}
	});
