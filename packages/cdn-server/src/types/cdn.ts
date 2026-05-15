import { z } from "zod";
import type { router } from "../router.ts";

export const CdnFileSchema = z.object({
	key: z.string(),
	lastModified: z.date().optional(),
	size: z.number().optional(),
});

export const CdnFolderSchema = z.object({
	prefix: z.string(),
});

export type CdnFile = z.infer<typeof CdnFileSchema>;
export type CdnFolder = z.infer<typeof CdnFolderSchema>;

export type GetFileMetaResult =
	| { exists: false }
	| {
			exists: true;
			size: number;
			contentType?: string;
			lastModified?: Date;
	  };

export interface GetFilesResult {
	folders: CdnFolder[];
	files: CdnFile[];
	nextToken?: string;
	isTruncated: boolean;
}

export type RouterType = typeof router;
