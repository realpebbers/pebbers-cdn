import type { CdnFile } from "@pebbers/cdn-server";
import { create } from "zustand";

interface FilesStore {
	selectedFiles: Set<string>;
	modifiedFiles: Set<string>;
	openFiles: CdnFile[];

	activeFile?: CdnFile;
	lastSelectedFile?: CdnFile;

	selectOne(file: CdnFile): void;
	selectMore(file: CdnFile): void;

	openFile(file: CdnFile): void;
	closeFile(file: CdnFile): void;
}

export const useFiles = create<FilesStore>()((set) => ({
	selectedFiles: new Set(),
	modifiedFiles: new Set(),
	openFiles: [],
	activeFile: undefined,

	selectOne: (file) =>
		set({ selectedFiles: new Set([file.key]), lastSelectedFile: file }),

	selectMore: (file) =>
		set((st) => ({
			selectedFiles: new Set([...st.selectedFiles, file.key]),
			lastSelectedFile: file,
		})),
	openFile: (file) =>
		set((st) => ({
			openFiles: st.openFiles.find((f) => f.key === file.key)
				? st.openFiles
				: [...st.openFiles, file],
			activeFile: file,
		})),

	closeFile: (file) =>
		set((st) => {
			const newOpenFiles = st.openFiles.filter((f) => f.key !== file.key);
			let activeFile = st.activeFile;

			if (activeFile.key === file.key) {
				activeFile =
					newOpenFiles.length > 0
						? newOpenFiles[newOpenFiles.length - 1]
						: undefined;
			}

			const modifiedFiles = new Set(st.modifiedFiles);

			modifiedFiles.delete(file.key);

			return {
				openFiles: newOpenFiles,
				activeFile: activeFile,
				modifiedFiles: modifiedFiles,
			};
		}),
}));
