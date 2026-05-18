import type { CdnFile } from "@pebbers/cdn-server";
import { useEffect, useState } from "react";
import { client } from "@/api/api-client";
import { isImageMime, isMimeType } from "@/lib/mime";
import { formatFileSize, getFileExtension } from "@/lib/utils";

interface FileEditorProps {
	file: CdnFile;
}

function getLineNumbers(content: string): number[] {
	return content.split("\n").map((_, i) => i + 1);
}

interface TextEditorProps {
	lineNumbers: number[];
	contents: string;
}

function TextEditor({ lineNumbers, contents }: TextEditorProps) {
	return (
		<div className="flex flex-1 overflow-hidden">
			{/* Line numbers */}
			<div className="shrink-0 w-12 bg-sidebar border-r border-border overflow-hidden">
				<div className="py-4 pr-3 text-right">
					{lineNumbers.map((num) => (
						<div
							key={num}
							className="font-mono text-xs text-muted-foreground leading-6 select-none"
						>
							{num}
						</div>
					))}
				</div>
			</div>

			{/* Text area */}
			<textarea
				value={contents}
				// onChange={handleChange}
				className="flex-1 p-4 bg-card text-foreground font-mono text-sm leading-6 resize-none outline-none focus:ring-0 border-none"
				spellCheck={false}
				style={{
					tabSize: 2,
				}}
			/>
		</div>
	);
}

export function FileEditor({ file }: FileEditorProps) {
	// const [isModified, setIsModified] = useState(false);

	// const [exists, setExists] = useState(true);
	const [loaded, setLoaded] = useState(false);
	const [isImage, setIsImage] = useState(false);
	const [contents, setContents] = useState("");
	const [supported, setSupported] = useState(true);

	useEffect(() => {
		const controller = new AbortController();

		async function run() {
			const meta = await client.getFileMeta(
				{ key: file.key },
				{ signal: controller.signal },
			);

			// setExists(meta.exists);

			if (!meta.exists) return;

			const fileType = meta.contentType;
			const { url } = await client.getFilePresigned(
				{ key: file.key },
				{ signal: controller.signal },
			);

			if (isMimeType(fileType) && isImageMime(fileType)) {
				setIsImage(true);
				setContents(url);
				setLoaded(true);
				return;
			}

			const res = await fetch(url, { signal: controller.signal });
			try {
				const text = await res.text();

				setContents(text);
				setLoaded(true);
			} catch (err) {
				if (err instanceof TypeError) {
					setSupported(false);
					return;
				}

				throw err;
			}
		}

		run().catch((err) => {
			if (err.name !== "AbortError") console.error(err);
		});

		return () => {
			controller.abort();
		};
	}, [file.key]);

	// const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
	// const newContent = e.target.value;
	// setContent(newContent);
	// setIsModified(newContent !== file.content);
	// onContentChange(file.key, newContent);
	// };

	const lineNumbers = isImage ? [] : getLineNumbers(contents);
	const ext = getFileExtension(file.key);

	return (
		<div className="flex flex-col h-full bg-card">
			{/* Editor toolbar */}
			<div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
				<div className="flex items-center gap-3">
					<span className="font-mono text-xs text-muted-foreground">
						{file.key}
					</span>
				</div>
				<div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
					<span>{ext.toUpperCase() || "TEXT"}</span>
					<span>{formatFileSize(file.size || 0)}</span>
				</div>
			</div>

			{
				/* Editor content */
				supported ? (
					loaded ? (
						isImage ? (
							<img className="self-center" alt="preview" src={contents} />
						) : (
							<TextEditor lineNumbers={lineNumbers} contents={contents} />
						)
					) : (
						<span className="self-center">Loading...</span>
					)
				) : (
					<span className="self-center">Unsupported file format.</span>
				)
			}
		</div>
	);
}
