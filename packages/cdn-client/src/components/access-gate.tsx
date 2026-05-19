import { ORPCError } from "@orpc/client";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import { client } from "@/api/api-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInputState } from "@/hooks/use-input-state";

export function AccessGate() {
	const [password, setPassword] = useInputState("");
	const [errMessage, setErrMessage] = useState("");

	const onSubmit = () => {
		async function run() {
			try {
				const { ok } = await client.login({ password: password });
				if (ok) {
					setErrMessage("");
					navigate("/");
				}
			} catch (err) {
				if (err instanceof ORPCError) {
					setErrMessage(err.message);
					return;
				}

				throw err;
			}
		}

		run().catch(console.error);
	};

	return (
		<div className="flex h-screen justify-center items-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Input
									id="password"
									placeholder="Password"
									type="password"
									value={password}
									onChange={setPassword}
									required
								/>
								{errMessage && (
									<p className="text-sm text-destructive">{errMessage}</p>
								)}
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex-col gap-2">
					<Button onClick={onSubmit} type="submit" className="w-full bg-accent">
						Login
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
