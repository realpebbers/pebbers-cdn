import { createORPCClient, ORPCError, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { RouterType } from "@pebbers/cdn-server";

const baseUrl = import.meta.env.DEV
	? "http://localhost:6767"
	: "https://cdn.pebbers.dev";

const link = new RPCLink({
	url: `${baseUrl}/rpc`,
	headers: () => ({
		authorization: "Bearer token",
	}),
	fetch: (url, init) => fetch(url, { ...init, credentials: "include" }),
	interceptors: [
		onError((error) => {
			if (error instanceof Error && error.name === "AbortError") return;
			if (error instanceof ORPCError && error.code === "UNAUTHORIZED") return;

			console.error(error);
		}),
	],
});

export const client: RouterClient<RouterType> = createORPCClient(link);
