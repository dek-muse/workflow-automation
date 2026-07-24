import type { AiProvider } from "./provider.interface";
export const anthropicProvider: AiProvider = { key: "anthropic", async generateStructured() { throw new Error("Anthropic provider is not enabled until ANTHROPIC_API_KEY is configured and the adapter is implemented."); } };
