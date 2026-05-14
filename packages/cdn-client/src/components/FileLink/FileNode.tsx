import { useState } from "react";
import { FileTree } from "../Files/FileTree.tsx";

interface FileLinkProps {
	type: "file" | "folder";

	name: string;
}

export function FileNode({ type, name }: FileLinkProps) {
	const [everOpened, setEverOpened] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	let showOnOpened = true;

	const cleanName = name
		.split("/")
		.filter((s) => s)
		.pop();

	if (type === "file") {
		return (
			<li>
				<a href={`/${name}`}>{cleanName}</a>
			</li>
		);
	}

	function toggleOpen() {
		if (everOpened) {
			if (hasLoaded) {
				setIsOpen(!isOpen);
			} else {
				showOnOpened = !showOnOpened;
			}
		} else {
			setEverOpened(true);
		}
	}

	function onLoaded() {
		setHasLoaded(true);
		setIsOpen(showOnOpened);
	}

	return (
		<li>
			<span onClick={() => toggleOpen()} onKeyDown={() => toggleOpen()}>
				{isOpen ? "📂" : "📁"}
				{cleanName}
			</span>
			{everOpened && (
				<FileTree prefix={name} onLoad={onLoaded} isOpen={isOpen} />
			)}
		</li>
	);
}
