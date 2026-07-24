import { env } from "@/config/env";
import { mockProvider } from "./mock.provider";
import { openAiProvider } from "./openai.provider";
import { anthropicProvider } from "./anthropic.provider";
export function resolveAiProvider() { if (env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY) return openAiProvider; if (env.AI_PROVIDER === "anthropic" && env.ANTHROPIC_API_KEY) return anthropicProvider; return mockProvider; }
