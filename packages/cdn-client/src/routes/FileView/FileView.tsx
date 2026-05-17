import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { client } from "../../api/api-client.ts";
import { isImageMime, isMimeType } from "../../lib/mime.ts";

// interface FileViewProps {}

export function FileView() {
	const [href] = useLocation();

	const location = href.substring(1); // skip initial /
	const [exists, setExists] = useState(true);
	const [isImage, setIsImage] = useState(false);
	const [contents, setContents] = useState("");
	useEffect(() => {
		const controller = new AbortController();

		async function run() {
			const meta = await client.getFileMeta(
				{ key: location },
				{ signal: controller.signal },
			);

			setExists(meta.exists);

			if (!meta.exists) return;
			if (!isMimeType(meta.contentType)) return;

			const fileType = meta.contentType;
			const { url } = await client.getFilePresigned(
				{ key: location },
				{ signal: controller.signal },
			);

			if (isImageMime(fileType)) {
				setIsImage(true);
				setContents(url);
				return;
			}

			const res = await fetch(url, { signal: controller.signal });
			const text = await res.text();

			setContents(text);
		}

		run().catch((err) => {
			if (err.name !== "AbortError") console.error(err);
		});

		return () => {
			controller.abort();
		};
	}, [location]);

	return (
		<>
			<header>
				<Link href="/">{"<"}</Link>
				<i>{exists ? location : "File not found"}</i>
			</header>

			<main>
				{isImage ? (
					<img src={contents} alt={location} />
				) : (
					<pre>{contents}</pre>
				)}
			</main>
		</>
	);
}
