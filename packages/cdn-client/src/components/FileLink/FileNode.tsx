import { useState } from "react";
import { FileTree } from "../Files/FileTree.tsx";
import styles from "./FileNode.module.css";

interface FileLinkProps {
	type: "file" | "folder" | "root";

	name?: string;
}

export function FileNode({ type, name }: FileLinkProps) {
	const [everOpened, setEverOpened] = useState(type === "root");
	const [isOpen, setIsOpen] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	let showOnOpened = true;

	const cleanName =
		type !== "root"
			? name
					.split("/")
					.filter((s) => s)
					.pop()
			: name;

	if (type === "file") {
		return (
			<li>
				<a className={styles.treeElement} href={`/${name}`}>
					{cleanName}
				</a>
			</li>
		);
	}

	function toggleOpen() {
		if (everOpened) {
			if (hasLoaded) {
				setIsOpen(!isOpen);
			} else if (type !== "root") {
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
			<span
				className={styles.treeElement}
				onClick={() => toggleOpen()}
				onKeyDown={() => toggleOpen()}
			>
				{isOpen ? "📂" : "📁"}
				{cleanName}
			</span>
			{everOpened && (
				<FileTree
					prefix={type === "root" ? undefined : name}
					onLoad={onLoaded}
					isOpen={isOpen}
				/>
			)}
		</li>
	);
}
