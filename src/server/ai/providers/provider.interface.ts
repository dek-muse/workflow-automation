import { z } from "zod";
export const aiActionSchema = z.object({ type: z.enum(["complete", "tool", "approval"]), summary: z.string(), toolName: z.string().optional(), toolInput: z.unknown().optional(), result: z.unknown().optional() });
export type AiAction = z.infer<typeof aiActionSchema>;
export type AiRequestInput = { system: string; task: string; context: unknown; tools: string[]; schema?: z.ZodTypeAny; timeoutMs: number };
export type AiProviderResult<T> = { output: T; inputTokens: number; outputTokens: number; estimatedCostCents: number; raw: unknown };
export interface AiProvider { key: string; generateStructured<T>(input: AiRequestInput, schema: z.ZodType<T>): Promise<AiProviderResult<T>>; }
