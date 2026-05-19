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

export const S3BucketSchema = z.object({
	name: z.string(),
	region: z.string(),
});

export type CdnFile = z.infer<typeof CdnFileSchema>;
export type CdnFolder = z.infer<typeof CdnFolderSchema>;
export type S3Bucket = z.infer<typeof S3BucketSchema>;

export const DEFAULT_BUCKET: S3Bucket = {
	region: "eu-central-1",
	name: "pebbers-cdn",
};

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
