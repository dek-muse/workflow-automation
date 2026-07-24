import { prisma } from "@/server/database/client";
import { runAgentTask } from "@/server/ai/ai.service";
import type { WorkflowExecutionInput, NodeResult } from "./workflow.types";
export class WorkflowEngine {
  async start(input: WorkflowExecutionInput) {
    const execution = await prisma.workflowExecution.upsert({ where: { workflowId_idempotencyKey: { workflowId: input.workflowId, idempotencyKey: input.idempotencyKey } }, update: {}, create: { workspaceId: input.workspaceId, workflowId: input.workflowId, idempotencyKey: input.idempotencyKey, input: input.input as object, status: "QUEUED" } });
    return this.run(execution.id);
  }
  async run(executionId: string) {
    const execution = await prisma.workflowExecution.findUniqueOrThrow({ where: { id: executionId }, include: { workflow: { include: { nodes: { orderBy: { sortOrder: "asc" } } } } } });
    await prisma.workflowExecution.update({ where: { id: executionId }, data: { status: "RUNNING", startedAt: new Date() } });
    let state: unknown = execution.input;
    for (const node of execution.workflow.nodes) {
      const result = await this.executeNode(node.type, node.config, state, execution.workspaceId, execution.id);
      await prisma.workflowStepExecution.create({ data: { executionId, nodeKey: node.key, nodeType: node.type, status: result.status === "completed" ? "COMPLETED" : result.status === "waiting_for_approval" ? "WAITING_FOR_APPROVAL" : "FAILED", input: state as object, output: result.output as object | undefined, error: result.error as object | undefined, startedAt: new Date(), completedAt: result.status === "completed" ? new Date() : undefined } });
      if (result.status === "waiting_for_approval") return prisma.workflowExecution.update({ where: { id: executionId }, data: { status: "WAITING_FOR_APPROVAL" } });
      if (result.status === "failed") return prisma.workflowExecution.update({ where: { id: executionId }, data: { status: "FAILED", error: result.error as object } });
      state = result.output ?? state;
    }
    return prisma.workflowExecution.update({ where: { id: executionId }, data: { status: "COMPLETED", output: state as object, completedAt: new Date() } });
  }
  private async executeNode(type: string, config: unknown, state: unknown, workspaceId: string, executionId: string): Promise<NodeResult> {
    if (type === "human_approval") { await prisma.approvalRequest.create({ data: { workspaceId, executionId, requestedAction: "workflow.approval", inputPayload: state as object, humanSummary: "Workflow requires human approval before continuing.", riskLevel: "medium" } }); return { status: "waiting_for_approval", output: { approvalRequired: true } }; }
    if (type === "ai_agent") { const result = await runAgentTask({ system: "You are a FlowPilot AI business automation agent.", task: JSON.stringify(state), context: state, allowedTools: ["tasks.create", "contacts.create", "notifications.create"], toolContext: { workspaceId, role: "OWNER" }, maxSteps: 3, timeoutMs: 30000 }); return result.status === "completed" ? { status: "completed", output: result } : { status: result.status as "waiting_for_approval" | "failed", output: result }; }
    if (type === "create_task") return { status: "completed", output: { ...state as object, taskCreated: true, config } };
    if (type === "condition") return { status: "completed", output: state };
    if (type === "delay") return { status: "completed", output: state };
    return { status: "completed", output: state };
  }
}
export const workflowEngine = new WorkflowEngine();
