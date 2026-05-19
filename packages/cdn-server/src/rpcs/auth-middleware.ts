import { ORPCError, os } from "@orpc/server";
import { hmac, parseCookie, timingSafeEqual } from "../lib/utils";
import type { InitialContext } from "../types/context";

export const pub = os.$context<InitialContext>();

export const SESSION_VALUE = "authenticated";

export const authed = pub.middleware(async ({ context, next }) => {
	const cookieHeader = context.headers.get("cookie") ?? "";
	const session = parseCookie(cookieHeader, "session");

	if (!(await isValidSession(session))) {
		throw new ORPCError("UNAUTHORIZED", { message: "Not logged in" });
	}

	return next({ context: { ...context } });
});

async function isValidSession(cookie: string | null): Promise<boolean> {
	if (!cookie) return false;
	const [value, sig] = cookie.split(".");
	if (value !== SESSION_VALUE || !sig) return false;
	const expected = await hmac(SESSION_VALUE);
	return timingSafeEqual(sig, expected);
}
