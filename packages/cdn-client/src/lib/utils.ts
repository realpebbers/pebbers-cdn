import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCleanFileName(filename: string) {
	return filename
		.split("/")
		.filter((s) => s)
		.pop();
}

export function getFileExtension(filename: string) {
	return filename.split(".").pop();
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function getLanguageFromExtension(ext: string): string {
	const languageMap: Record<string, string> = {
		json: "json",
		yaml: "yaml",
		yml: "yaml",
		md: "markdown",
		sh: "bash",
		svg: "xml",
		log: "plaintext",
	};
	return languageMap[ext] || "plaintext";
}
