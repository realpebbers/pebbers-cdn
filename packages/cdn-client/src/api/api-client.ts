import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { RouterType } from "@pebbers/cdn-server";

const link = new RPCLink({
	url: "http://localhost:6767/rpc",
	headers: () => ({
		authorization: "Bearer token",
	}),
	// fetch: <-- provide fetch polyfill fetch if needed
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const client: RouterClient<RouterType> = createORPCClient(link);
