import {
	File,
	FileArchive,
	FileCode,
	FileJson,
	FileText,
	Folder,
	FolderOpen,
	Image,
} from "lucide-react";
import { getFileExtension } from "@/lib/utils";

interface FileIconProps {
	filename: string;
}

interface FolderIconProps {
	isOpen: boolean;
}

export function FolderIcon({ isOpen }: FolderIconProps) {
	return isOpen ? (
		<FolderOpen className="size-4 text-amber-500" />
	) : (
		<Folder className="size-4 text-amber-500" />
	);
}

export function FileIcon({ filename }: FileIconProps) {
	const ext = getFileExtension(filename);
	switch (ext) {
		case "json":
			return <FileJson className="size-4 text-yellow-400" />;
		case "md":
			return <FileText className="size-4 text-blue-400" />;
		case "yaml":
		case "yml":
			return <FileCode className="size-4 text-pink-400" />;
		case "sh":
			return <FileCode className="size-4 text-green-400" />;
		case "svg":
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
			return <Image className="size-4 text-purple-400" />;
		case "log":
			return <FileArchive className="size-4 text-gray-400" />;
		case "pdf":
			return <File className="size-4 text-red-400" />;
		default:
			return <File className="size-4 text-muted-foreground" />;
	}
}
