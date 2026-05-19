import { pub } from "./rpcs/auth-middleware.ts";
import { getFilePresignedRPC } from "./rpcs/file.ts";
import { getFileMetaRPC } from "./rpcs/fileMeta.ts";
import { getFilesRPC } from "./rpcs/files.ts";
import { loginRPC } from "./rpcs/login.ts";
import { meRPC } from "./rpcs/me.ts";
import { uploadFileRPC } from "./rpcs/upload.ts";

export const router = pub.router({
	getFiles: getFilesRPC,
	uploadFile: uploadFileRPC,
	getFilePresigned: getFilePresignedRPC,
	getFileMeta: getFileMetaRPC,
	login: loginRPC,
	me: meRPC,
});
