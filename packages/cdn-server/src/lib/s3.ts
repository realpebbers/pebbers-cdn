import {
	GetObjectCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getMimeType } from "hono/utils/mime";
import type { GetFileMetaResult, GetFilesResult } from "../types/cdn";
import { env } from "./env";
import {
	GetFileMetaError,
	GetFilePresignedError,
	GetFilesError,
	UploadError,
} from "./errors";

const s3Client = new S3Client({
	region: env.AWS_REGION,
	...(env.ACCESS_KEY_ID &&
		env.SECRET_ACCESS_KEY && {
			credentials: {
				accessKeyId: env.ACCESS_KEY_ID,
				secretAccessKey: env.SECRET_ACCESS_KEY,
			},
		}),
});

export const BUCKET = env.S3_BUCKET;

export async function getFileMeta(key: string): Promise<GetFileMetaResult> {
	try {
		const meta = await s3Client.send(
			new HeadObjectCommand({ Bucket: BUCKET, Key: key }),
		);

		return {
			exists: true,
			size: meta.ContentLength ?? 0,
			contentType: meta.ContentType?.split(";")[0],
			lastModified: meta.LastModified,
		};
	} catch (err) {
		if (err instanceof S3ServiceException) {
			if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") {
				return { exists: false };
			}
		}

		throw new GetFileMetaError({ cause: err });
	}
}

export async function getFilePresigned(key: string) {
	try {
		const cmd = new GetObjectCommand({
			Bucket: BUCKET,
			Key: key,
		});

		return await getSignedUrl(s3Client, cmd, {
			expiresIn: 60,
		});
	} catch (err) {
		throw new GetFilePresignedError({ cause: err });
	}
}

export async function getFiles(
	maxFiles: number = 50,
	prefix?: string,
	nextToken?: string,
): Promise<GetFilesResult> {
	try {
		const response = await s3Client.send(
			new ListObjectsV2Command({
				Bucket: BUCKET,
				MaxKeys: maxFiles,
				Prefix: prefix,
				Delimiter: "/",
				ContinuationToken: nextToken,
			}),
		);

		return {
			files:
				response.Contents?.map((obj) => {
					return {
						key: obj.Key ?? "EMPTY_FILE_NAME",
						lastModified: obj.LastModified,
						size: obj.Size,
					};
				}).filter((file) => file.key !== prefix) ?? [],
			folders:
				response.CommonPrefixes?.map((folder) => ({
					prefix: folder.Prefix ?? "EMPTY_FOLDER_NAME",
				})) ?? [],
			isTruncated: response.IsTruncated ?? false,
			nextToken: response.NextContinuationToken,
		};
	} catch (err) {
		console.error(err);

		throw new GetFilesError({ cause: (err as Error).cause });
	}
}

export async function uploadFilePresigned() {}

export async function uploadFile(
	key: string,
	body: ReadableStream,
	contentType?: string,
) {
	const upload = new Upload({
		client: s3Client,
		params: {
			Bucket: BUCKET,
			Key: key,
			Body: body,
			ContentType:
				contentType ?? getMimeType(key) ?? "application/octet-stream",
		},
	});

	try {
		return await upload.done();
	} catch (err) {
		console.error(err);

		throw new UploadError({ cause: err });
	}
}
