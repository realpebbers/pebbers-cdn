import { authed, pub } from "./auth-middleware";

export const meRPC = pub.use(authed).handler(() => {
	return { ok: true };
});
