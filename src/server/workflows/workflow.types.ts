export type WorkflowNodeType = "ai_agent" | "http_request" | "send_email" | "create_task" | "update_record" | "delay" | "condition" | "human_approval" | "notification" | "transform_data" | "end";
export type WorkflowExecutionInput = { workspaceId: string; workflowId: string; actorId?: string; idempotencyKey: string; input: unknown };
export type NodeResult = { status: "completed" | "waiting_for_approval" | "failed"; output?: unknown; error?: unknown };
