import { os } from "@orpc/server";
import { getFilesRPC } from "./rpcs/files.ts";
import { uploadFileRPC } from "./rpcs/upload.ts";

export const router = os.router({
	getFiles: getFilesRPC,
	uploadFile: uploadFileRPC,
});
