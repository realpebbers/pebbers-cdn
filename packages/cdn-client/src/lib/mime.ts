export const MIME = {
	text: {
		plain: "text/plain",
		html: "text/html",
		css: "text/css",
		javascript: "text/javascript",
		markdown: "text/markdown",
		xml: "text/xml",
		json: "application/json",
	},
	image: {
		png: "image/png",
		jpeg: "image/jpeg",
		gif: "image/gif",
		svg: "image/svg+xml",
		webp: "image/webp",
	},
} as const;

type MimeValues<T> = T[keyof T];

export type TextMimeType = MimeValues<typeof MIME.text>;
export type ImageMimeType = MimeValues<typeof MIME.image>;
export type MimeType = TextMimeType | ImageMimeType;

export const TEXT_MIMES = Object.values(MIME.text);
export const IMAGE_MIMES = Object.values(MIME.image);
export const ALL_MIMES = [...TEXT_MIMES, ...IMAGE_MIMES] as const;

export function isMimeType(value: string): value is MimeType {
	return (ALL_MIMES as readonly string[]).includes(value);
}

export function isTextMime(value: MimeType): value is TextMimeType {
	return (TEXT_MIMES as readonly string[]).includes(value);
}

export function isImageMime(value: MimeType): value is ImageMimeType {
	return (IMAGE_MIMES as readonly string[]).includes(value);
}
