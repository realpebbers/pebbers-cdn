import { useQuery } from "@tanstack/react-query";
import { client } from "@/api/api-client";

export function useAuth() {
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			try {
				return await client.me();
			} catch {
				return { ok: false };
			}
		},
		retry: false,
		staleTime: Infinity, // don't refetch unless you tell it to
	});
}
