import type { CdnFile, CdnFolder } from "@pebbers/cdn-server";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { client } from "@/api/api-client.ts";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useStable } from "@/hooks/stable";
import { cn, getCleanFileName } from "@/lib/utils";
import { useFiles } from "@/store/useFiles.ts";
import { FileIcon, FolderIcon } from "./file-icon";

interface FileNodeProps {
	name: string;
	type: "file" | "folder";
	depth: number;
	// onSelect: (item: CdnFile) => void;
	// onDownload: (item: CdnFile) => void;
	// onDelete: (item: CdnFile) => void;
	// onCopyPath: (item: CdnFile) => void;
	// onRename: (item: CdnFile) => void;
}

// TODO: seperate file and folder components
function FileNode({
	name,
	type,
	depth,
	// onSelect,
	// onDownload,
	// onDelete,
	// onCopyPath,
	// onRename,
}: FileNodeProps) {
	const [everOpened, setEverOpened] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const isSelected = useFiles((st) => st.selectedFiles.has(name));
	const openFile = useFiles((st) => st.openFile);

	const cleanName = getCleanFileName(name);

	const handleClick = () => {
		if (type === "folder") {
			if (loaded) {
				setIsOpen(!isOpen);
			} else {
				setEverOpened(true);
			}
		} else {
			// TODO: pass down the CdnFile when seperating File and Folder nodes
			openFile({ key: name });
		}
	};

	const onLoad = () => {
		setIsOpen(true);
		setLoaded(true);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div>
					<div
						className={cn(
							"flex items-center gap-1 py-1 px-1 cursor-pointer hover:bg-accent/50 transition-colors font-mono text-sm",
							isSelected && "bg-accent text-accent-foreground",
						)}
						style={{ paddingLeft: `${depth * 12 + 8}px` }}
						onClick={handleClick}
						onKeyDown={handleClick}
					>
						{type === "folder" ? (
							<span className="w-4 flex items-center justify-center">
								{isOpen ? (
									<ChevronDown className="size-3 text-muted-foreground" />
								) : (
									<ChevronRight className="size-3 text-muted-foreground" />
								)}
							</span>
						) : (
							<span className="w-4" />
						)}
						{type === "folder" ? (
							<FolderIcon isOpen={isOpen} />
						) : (
							<FileIcon filename={cleanName} />
						)}
						<span className="truncate">{cleanName}</span>
					</div>
					{type === "folder" && everOpened && (
						<FileTree
							prefix={name}
							depth={depth}
							isOpen={isOpen}
							// onSelect={onSelect}
							// onDownload={onDownload}
							// onDelete={onDelete}
							// onCopyPath={onCopyPath}
							// onRename={onRename}
							onLoad={() => onLoad()}
						/>
					)}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-56">
				{/*{item.type === "file" && (*/}
				{/*	<>*/}
				{/*		<ContextMenuItem onClick={() => onSelect(item)}>*/}
				{/*			Open*/}
				{/*			<ContextMenuShortcut>Enter</ContextMenuShortcut>*/}
				{/*		</ContextMenuItem>*/}
				{/*		<ContextMenuSeparator />*/}
				{/*	</>*/}
				{/*)}*/}
				{/*<ContextMenuItem onClick={() => onCopyPath(item)}>*/}
				{/*	Copy Path*/}
				{/*	<ContextMenuShortcut>⌘C</ContextMenuShortcut>*/}
				{/*</ContextMenuItem>*/}
				{/*<ContextMenuItem onClick={() => onRename(item)}>*/}
				{/*	Rename*/}
				{/*	<ContextMenuShortcut>F2</ContextMenuShortcut>*/}
				{/*</ContextMenuItem>*/}
				{/*<ContextMenuSeparator />*/}
				{/*{item.type === "file" && (*/}
				{/*	<ContextMenuItem onClick={() => onDownload(item)}>*/}
				{/*		Download*/}
				{/*		<ContextMenuShortcut>⌘S</ContextMenuShortcut>*/}
				{/*	</ContextMenuItem>*/}
				{/*)}*/}
				{/*<ContextMenuItem onClick={() => onDelete(item)} variant="destructive">*/}
				{/*	Delete*/}
				{/*	<ContextMenuShortcut>⌫</ContextMenuShortcut>*/}
				{/*</ContextMenuItem>*/}
			</ContextMenuContent>
		</ContextMenu>
	);
}

interface FileTreeProps {
	prefix?: string;
	depth: number;
	isOpen: boolean;
	onLoad?: () => void;
	// onDownload: (item: CdnFile) => void;
	// onDelete: (item: CdnFile) => void;
	// onSelect: (item: CdnFile) => void;
	// onCopyPath: (item: CdnFile) => void;
	// onRename: (item: CdnFile) => void;
}

export function FileTree({
	prefix,
	depth,
	isOpen,
	// onSelect,
	// onDownload,
	// onDelete,
	// onCopyPath,
	// onRename,
	onLoad,
}: FileTreeProps) {
	const [files, setFiles] = useState<CdnFile[]>([]);
	const [folders, setFolders] = useState<CdnFolder[]>([]);

	const isEmpty = files.length === 0 && folders.length === 0;
	const stableOnLoad = useStable(onLoad ?? (() => {}));

	useEffect(() => {
		client
			.getFiles({ prefix: prefix })
			.then((res) => {
				setFiles(res.files);
				setFolders(res.folders);

				stableOnLoad?.();
			})
			.catch((err) => {
				console.error(err);
			});
	}, [prefix]);

	return (
		<div className={cn(isOpen || "hidden")}>
			{folders.map((item) => (
				<FileNode
					key={item.prefix}
					name={item.prefix}
					type="folder"
					depth={depth + 1}
					// onSelect={onSelect}
					// onDownload={onDownload}
					// onDelete={onDelete}
					// onCopyPath={onCopyPath}
					// onRename={onRename}
				/>
			))}

			{files.map((item) => (
				<FileNode
					key={item.key}
					type="file"
					name={item.key}
					depth={depth + 1}
					// onSelect={onSelect}
					// onDownload={onDownload}
					// onDelete={onDelete}
					// onCopyPath={onCopyPath}
					// onRename={onRename}
				/>
			))}

			{isEmpty && isOpen && (
				<p
					style={{
						paddingLeft: `${depth * 12 + 44}px`,
					}}
					className="truncate text-muted-foreground"
				>
					Empty
				</p>
			)}
		</div>
	);
}
