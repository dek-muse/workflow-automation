import { aiActionSchema } from "./providers/provider.interface";
import { resolveAiProvider } from "./providers";
import { executeTool, type ToolContext } from "./tools/tool-registry";
export async function runAgentTask(input: { system: string; task: string; context: unknown; allowedTools: string[]; toolContext: ToolContext; maxSteps: number; timeoutMs: number }) {
  const provider = resolveAiProvider();
  const trace: unknown[] = [];
  let lastObservation: unknown = input.context;
  for (let step = 0; step < input.maxSteps; step++) {
    const result = await provider.generateStructured({ system: input.system, task: input.task, context: lastObservation, tools: input.allowedTools, timeoutMs: input.timeoutMs }, aiActionSchema);
    trace.push({ step, provider: provider.key, modelOutput: result.output, usage: { inputTokens: result.inputTokens, outputTokens: result.outputTokens, estimatedCostCents: result.estimatedCostCents } });
    if (result.output.type === "complete") return { status: "completed", output: result.output.result, trace };
    if (result.output.type === "approval") return { status: "waiting_for_approval", output: result.output, trace };
    if (!result.output.toolName || !input.allowedTools.includes(result.output.toolName)) return { status: "failed", output: { error: "Tool was not allowed." }, trace };
    lastObservation = await executeTool(result.output.toolName, result.output.toolInput, input.toolContext);
    trace.push({ step, tool: result.output.toolName, observation: lastObservation });
    if ((lastObservation as { paused?: boolean }).paused) return { status: "waiting_for_approval", output: lastObservation, trace };
  }
  return { status: "failed", output: { error: "Maximum agent steps exceeded." }, trace };
}
