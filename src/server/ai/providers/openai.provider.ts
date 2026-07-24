import type { AiProvider } from "./provider.interface";
export const openAiProvider: AiProvider = { key: "openai", async generateStructured() { throw new Error("OpenAI provider is not enabled until OPENAI_API_KEY is configured and the adapter is implemented."); } };
