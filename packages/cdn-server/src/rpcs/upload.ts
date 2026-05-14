import { ORPCError, os } from "@orpc/server";
import z from "zod";
import { UploadError } from "../lib/errors";
import { uploadFile } from "../lib/s3";

export const uploadFileRPC = os
	.input(z.object({ payload: z.file() }))
	.handler(async ({ input }) => {
		try {
			await uploadFile(input.payload.name, input.payload.stream());
		} catch (err) {
			if (err instanceof UploadError) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: err.cause });
			}
		}
	});
