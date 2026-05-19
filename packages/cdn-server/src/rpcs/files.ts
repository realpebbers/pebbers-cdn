import { ORPCError } from "@orpc/server";
import z from "zod";
import { GetFilesError } from "../lib/errors.ts";
import { getFiles } from "../lib/s3";
import { authed, pub } from "./auth-middleware.ts";

const FilesRouteSchema = z.object({
	maxFiles: z.number().optional().default(50),
	prefix: z.string().optional(),
	nextToken: z.string().optional(),
});

export const getFilesRPC = pub
	.use(authed)
	.input(FilesRouteSchema)
	.handler(async ({ input }) => {
		try {
			return await getFiles(input.maxFiles, input.prefix, input.nextToken);
		} catch (err) {
			if (err instanceof GetFilesError) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", { cause: err.cause });
			}
		}
	});
