import { os } from "@orpc/server";
import { getFilePresignedRPC } from "./rpcs/file.ts";
import { getFilesRPC } from "./rpcs/files.ts";
import { uploadFileRPC } from "./rpcs/upload.ts";

export const router = os.router({
	getFiles: getFilesRPC,
	uploadFile: uploadFileRPC,
	getFile: getFilePresignedRPC,
});
