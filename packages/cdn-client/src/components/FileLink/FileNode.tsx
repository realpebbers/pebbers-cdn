import { clsx } from "clsx";
import { useState } from "react";
import { useFiles } from "../../store/useFiles.ts";
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

	const isSelected = useFiles((st) => st.selectedFiles.has(name));
	const select = useFiles((st) => st.selectOne);

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
			<li className={clsx(styles.treeElement, isSelected && styles.selected)}>
				<span
					onFocus={() => select(name)}
					onKeyDown={() => {}} // TODO: open
					onClick={() => select(name)}
				>
					{cleanName}
				</span>
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
		<li
			className={clsx(styles.treeElement, type === "root" && styles.treeRoot)}
		>
			<div>
				<span
					onClick={() => select(name)}
					onFocus={() => select(name)}
					onKeyDown={() => toggleOpen()}
				>
					{isOpen ? "📂" : "📁"}
					{cleanName}
				</span>
			</div>
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
