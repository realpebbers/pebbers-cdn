import type { CdnFile, CdnFolder } from "@pebbers/cdn-server";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { client } from "../../api/api-client.ts";
import { FileNode } from "../FileLink/FileNode.tsx";
import styles from "./FileTree.module.css";

interface FileTreeProps {
	prefix?: string;
	onLoad?: () => void;
	isOpen: boolean;
}

export function FileTree({ prefix, onLoad, isOpen }: FileTreeProps) {
	const [files, setFiles] = useState<CdnFile[]>([]);
	const [folders, setFolders] = useState<CdnFolder[]>([]);

	const isEmpty = files.length === 0 && folders.length === 0;

	// biome-ignore lint/correctness/useExhaustiveDependencies: onLoad is a one-shot signal
	useEffect(() => {
		client
			.getFiles({ prefix: prefix })
			.then((res) => {
				setFiles(res.files);
				setFolders(res.folders);

				onLoad?.();
			})
			.catch((err) => {
				console.error(err);
			});
	}, [prefix]);

	return (
		<ul
			className={clsx(styles.filesRoot, prefix && styles.filesChild)}
			data-open={isOpen}
		>
			{folders.map((folder) => (
				<FileNode key={folder.prefix} type="folder" name={folder.prefix} />
			))}

			{files.map((file) => (
				<FileNode key={file.key} type="file" name={file.key} />
			))}
			{isEmpty && isOpen && <p>Empty</p>}
		</ul>
	);
}
