import { env } from "./env";

export function parseCookie(cookieHeader: string, name: string): string | null {
	const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1] ?? "") : null;
}

export async function hmac(data: string): Promise<string> {
	const secret = env.PASSWORD_SECRET;
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign(
		"HMAC",
		key,
		new TextEncoder().encode(data),
	);
	return Buffer.from(sig).toString("base64url");
}

export function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++)
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return result === 0;
}
