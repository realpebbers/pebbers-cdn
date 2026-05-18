import { DEFAULT_BUCKET, type S3Bucket } from "@pebbers/cdn-server";
import {
	ChevronDown,
	ChevronLeft,
	Database,
	HardDrive,
	Plus,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { EditorTabs } from "@/components/editor-tabs";
import { FileEditor } from "@/components/file-editor";
import { FileTree } from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { mockBuckets, S3Bucket, S3Object } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useFiles } from "@/store/useFiles";
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

export function S3Explorer() {
	const [selectedBucket, setSelectedBucket] =
		useState<S3Bucket>(DEFAULT_BUCKET);

	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const activeFile = useFiles((st) => st.activeFile);

	// const handleContentChange = (key: string, content: string) => {
	// 	const file = openFiles.find((f) => f.key === key);
	// 	if (file && content !== file.content) {
	// 		setModifiedFiles((prev) => new Set(prev).add(key));
	// 	} else {
	// 		setModifiedFiles((prev) => {
	// 			const next = new Set(prev);
	// 			next.delete(key);
	// 			return next;
	// 		});
	// 	}
	// };

	return (
		<div className="h-screen">
			<ResizablePanelGroup
				orientation="horizontal"
				className="flex h-screen w-full bg-background"
			>
				{/* Sidebar */}
				{!sidebarCollapsed && (
					<ResizablePanel
						className="h-full"
						defaultSize="20%"
						minSize="15%"
						maxSize="40%"
					>
						<div className="flex flex-col h-full bg-sidebar border-r border-border">
							{/* Bucket selector */}
							<div className="flex items-center justify-between px-3 py-2 border-b border-border">
								<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									S3 Explorer
								</span>
								<div className="flex items-center gap-1">
									<Button
										aria-label="collapse"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={() => setSidebarCollapsed(true)}
									>
										<ChevronLeft className="size-3.5" />
									</Button>
								</div>
							</div>

							{/* Buckets list */}
							<div className="px-2 py-2">
								<ContextMenu>
									<ContextMenuTrigger asChild>
										<button
											type="button"
											onClick={() => setSelectedBucket(DEFAULT_BUCKET)}
											className={cn(
												"flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors",
												selectedBucket.name === DEFAULT_BUCKET.name
													? "bg-accent text-accent-foreground"
													: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
											)}
										>
											<Database className="size-4 text-primary" />
											<span className="font-mono text-sm truncate">
												{DEFAULT_BUCKET.name}
											</span>
											<ChevronDown
												className={cn(
													"size-3 ml-auto transition-transform",
													selectedBucket.name === DEFAULT_BUCKET.name
														? "rotate-0"
														: "-rotate-90",
												)}
											/>
										</button>
									</ContextMenuTrigger>
									<ContextMenuContent>
										<ContextMenuItem>
											<RefreshCw className="size-4 mr-2" />
											Refresh
										</ContextMenuItem>
										<ContextMenuSeparator />
										<ContextMenuItem>
											<Plus className="size-4 mr-2" />
											Create Folder
										</ContextMenuItem>
										<ContextMenuItem>
											<Plus className="size-4 mr-2" />
											Upload File
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>
							</div>

							{/* Bucket info */}
							<div className="px-4 py-2 border-t border-border">
								<div className="text-xs text-muted-foreground space-y-1">
									<div className="flex justify-between">
										<span>Region:</span>
										<span className="font-mono">{selectedBucket.region}</span>
									</div>
								</div>
							</div>

							{/* File tree */}
							<ScrollArea className="flex-1">
								<FileTree isOpen={true} depth={0} />
							</ScrollArea>
						</div>
					</ResizablePanel>
				)}

				{/* Main editor area */}
				<ResizablePanel className="h-full">
					<div className="flex-1 h-full flex flex-col min-w-0">
						{/* Editor tabs */}
						<EditorTabs />

						{/* Editor content */}
						<div className="flex-1 overflow-hidden">
							{activeFile ? (
								<FileEditor key={activeFile.key} file={activeFile} />
							) : (
								<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
									<HardDrive className="size-16 mb-4 opacity-20" />
									<p className="text-lg font-medium">No file selected</p>
									<p className="text-sm mt-1">
										Select a file from the sidebar to view and edit
									</p>
								</div>
							)}
						</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
