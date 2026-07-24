import { z } from "zod";
const envSchema = z.object({
  DATABASE_URL: z.string().min(1), REDIS_URL: z.string().default("redis://localhost:6379"), AUTH_SECRET: z.string().min(16), APP_URL: z.string().url().default("http://localhost:3000"), ENCRYPTION_KEY: z.string().min(16),
  AI_PROVIDER: z.enum(["mock", "openai", "anthropic", "google", "local"]).default("mock"), OPENAI_API_KEY: z.string().optional(), ANTHROPIC_API_KEY: z.string().optional(), GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(), S3_BUCKET: z.string().optional(), S3_ACCESS_KEY: z.string().optional(), S3_SECRET_KEY: z.string().optional()
});
export const env = envSchema.parse(process.env);
