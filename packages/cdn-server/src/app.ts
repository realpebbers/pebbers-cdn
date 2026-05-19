import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { Hono } from "hono";
import { router } from "./router.ts";

export const app = new Hono();

const handler = new RPCHandler(router, {
	plugins: [
		new CORSPlugin({
			origin: (origin, _) => origin,
			credentials: true,
			allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
		}),
	],
});

app.use("/rpc/*", async (c, next) => {
	const resHeaders = new Headers();
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {
			headers: c.req.raw.headers,
			resHeaders,
		},
	});

	if (matched) {
		resHeaders.forEach((value, key) => {
			response.headers.append(key, value);
		});

		return c.newResponse(response.body as ReadableStream<unknown>, response);
	}

	await next();
});

app.get("/", (c) => {
	return c.text("in construction...");
});
