import { X } from "lucide-react";
import { cn, getCleanFileName } from "@/lib/utils";
import { useFiles } from "@/store/useFiles";
import { FileIcon } from "./file-icon";

export function EditorTabs() {
	const { openFile, closeFile } = useFiles.getState();

	const openFiles = useFiles((st) => st.openFiles);
	const modifiedFiles = useFiles((st) => st.modifiedFiles);
	const activeFile = useFiles((st) => st.activeFile);

	if (openFiles.length === 0) {
		return (
			<div className="flex items-center h-9 bg-sidebar border-b border-border px-4">
				<span className="text-xs text-muted-foreground">No files open</span>
			</div>
		);
	}

	return (
		<div className="flex items-center h-9 bg-sidebar border-b border-border overflow-x-auto">
			{openFiles.map((file) => {
				const isActive = activeFile?.key === file.key;
				const isModified = modifiedFiles.has(file.key);
				const cleanName = getCleanFileName(file.key);

				return (
					<div
						key={file.key}
						className={cn(
							"flex items-center gap-2 h-full px-3 border-r border-border cursor-pointer transition-colors group",
							isActive
								? "bg-card text-foreground"
								: "bg-sidebar text-muted-foreground hover:bg-accent/30",
						)}
						onClick={() => {
							console.log(file.key);
							openFile(file);
						}}
					>
						{<FileIcon filename={file.key} />}
						<span className="font-mono text-xs whitespace-nowrap">
							{cleanName}
						</span>
						{isModified && <span className="w-2 h-2 rounded-full bg-primary" />}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();

								closeFile(file);
							}}
							className="p-0.5 rounded hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<X className="size-3" />
						</button>
					</div>
				);
			})}
		</div>
	);
}
