import { create } from "zustand";

interface FilesStore {
	selectedFiles: Set<string>;
	lastSelectedFile: string;

	selectOne(key: string): void;
}

export const useFiles = create<FilesStore>()((set) => ({
	selectedFiles: new Set(),
	lastSelectedFile: "",

	selectOne: (key) =>
		set({ selectedFiles: new Set([key]), lastSelectedFile: key }),
}));
