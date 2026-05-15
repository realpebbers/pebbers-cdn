import { clsx } from "clsx";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { useFiles } from "../../store/useFiles.ts";
import { FileTree } from "../FileTree/FileTree.tsx";
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
	const selectMore = useFiles((st) => st.selectMore);

	let showOnOpened = true;

	const cleanName =
		type !== "root"
			? name
					.split("/")
					.filter((s) => s)
					.pop()
			: name;

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

	function handleClick(e: React.MouseEvent) {
		if (e.ctrlKey) {
			selectMore(name);
			return;
		}
		if (isSelected) {
			select(name); // Select self, also deselects the other files
			if (type === "folder") toggleOpen();
			else navigate(`/${name}`, { replace: true });
			return;
		}
		select(name);
	}

	if (type === "file") {
		return (
			<li
				onFocus={() => select(name)}
				onKeyDown={() => {}}
				onClick={handleClick}
				className={clsx(styles.treeElement, isSelected && styles.selected)}
			>
				<span>{cleanName}</span>
			</li>
		);
	}

	function onLoaded() {
		setHasLoaded(true);
		setIsOpen(showOnOpened);
	}

	return (
		<li className={clsx(type === "root" && styles.treeRoot)}>
			<div
				className={clsx(styles.treeElement, isSelected && styles.selected)}
				onClick={handleClick}
				onFocus={() => select(name)}
				onKeyDown={() => toggleOpen()}
			>
				<span>
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
