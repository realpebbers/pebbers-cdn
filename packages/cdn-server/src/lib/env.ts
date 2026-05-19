import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(6767),
	AWS_REGION: z.string(),
	S3_BUCKET: z.string(),
	ACCESS_KEY_ID: z.string().optional(),
	SECRET_ACCESS_KEY: z.string().optional(),

	PASSWORD: z.string(),
	PASSWORD_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"[ERROR] Failed to parse .env, make sure it follows the .env.example file!",
	);
	console.error(z.treeifyError(parsedEnv.error).errors);

	process.exit(1);
}

export const env = parsedEnv.data;
export type Env = typeof env;
