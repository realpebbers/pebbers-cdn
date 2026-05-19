import { ORPCError } from "@orpc/server";
import z from "zod";
import { env } from "../lib/env";
import { hmac, timingSafeEqual } from "../lib/utils";
import { pub, SESSION_VALUE } from "./auth-middleware";

export const loginRPC = pub
	.input(z.object({ password: z.string().min(4).max(15) }))
	.handler(async ({ input, context }) => {
		if (!timingSafeEqual(input.password, env.PASSWORD)) {
			throw new ORPCError("UNAUTHORIZED", { message: "Wrong password" });
		}

		const cookie = await makeSessionCookie();
		console.log(`Cookie: ${cookie}`);

		context.resHeaders.set("Set-Cookie", cookie);
		console.log(context.resHeaders);
		return { ok: true };
	});

export async function makeSessionCookie(): Promise<string> {
	const sig = await hmac(SESSION_VALUE);
	const value = encodeURIComponent(`${SESSION_VALUE}.${sig}`);

	return [
		`session=${value}`,
		`Max-Age=${60 * 60 * 24 * 7}`, // 7 days
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		// 'Secure', // ← uncomment in production
	].join("; ");
}
