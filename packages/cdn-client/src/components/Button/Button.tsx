import { type ChangeEvent, type PropsWithChildren, useRef } from "react";
import { client } from "../../api/api-client.ts";

export function Button({ children }: PropsWithChildren) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		client.uploadFile({ payload: file });
		e.target.value = "";
	};

	return (
		<>
			<input
				type="file"
				ref={inputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
			<button type="button" onClick={() => inputRef.current?.click()}>
				{children}
			</button>
		</>
	);
}
