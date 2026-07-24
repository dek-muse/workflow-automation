import { prisma } from "@/server/database/client";

export type OverviewExecution = { id: string; workflowName: string; triggerType: string; status: string; createdAt: Date; durationMs: number | null; steps: number };
export type OverviewAgent = { id: string; name: string; status: string; modelProvider: string; modelName: string; tools: string[]; successRate: number; lastExecution: Date | null };
export type OverviewWorkflow = { id: string; name: string; status: string; triggerType: string; nodes: { key: string; type: string; name: string; sortOrder: number }[]; executions: number; successRate: number };
export type OverviewApproval = { id: string; requestedAction: string; status: string; riskLevel: string; humanSummary: string; createdAt: Date; workflowName: string | null };
export type OverviewContact = { id: string; firstName: string; lastName: string | null; email: string | null; company: string | null; status: string; tags: string[]; updatedAt: Date };
export type OverviewTask = { id: string; title: string; status: string; priority: string; dueDate: Date | null; contactName: string | null; updatedAt: Date };
export type OverviewActivity = { id: string; action: string; entityType: string; result: string; createdAt: Date; details: string };

export type WorkspaceOverview = {
  workspace: { id: string; name: string; slug: string; plan: string; timezone: string };
  metrics: { activeWorkflows: number; successRate: number; executionsThisMonth: number; pendingApprovals: number; aiRequests: number; tokenConsumption: number; estimatedAiCostCents: number; savedStaffTimeMinutes: number; tasksCreated: number; contactsProcessed: number; failureRate: number };
  agents: OverviewAgent[];
  workflows: OverviewWorkflow[];
  executions: OverviewExecution[];
  approvals: OverviewApproval[];
  contacts: OverviewContact[];
  tasks: OverviewTask[];
  activity: OverviewActivity[];
  recentErrors: OverviewExecution[];
};

const now = new Date("2026-07-24T12:00:00.000Z");

export async function getWorkspaceOverview(): Promise<WorkspaceOverview> {
  try {
    const workspace = await prisma.workspace.findFirst({ where: { deletedAt: null }, orderBy: { createdAt: "asc" } });
    if (!workspace) return fallbackOverview();
    const [activeWorkflows, executions, failed, completed, pendingApprovals, aiRequests, aiUsage, workflows, agents, approvals, contacts, tasks, activity] = await Promise.all([
      prisma.workflow.count({ where: { workspaceId: workspace.id, status: "ACTIVE", deletedAt: null } }),
      prisma.workflowExecution.findMany({ where: { workspaceId: workspace.id }, include: { workflow: true, steps: true }, orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.workflowExecution.count({ where: { workspaceId: workspace.id, status: "FAILED" } }),
      prisma.workflowExecution.count({ where: { workspaceId: workspace.id, status: "COMPLETED" } }),
      prisma.approvalRequest.count({ where: { workspaceId: workspace.id, status: "PENDING" } }),
      prisma.aiRequest.count({ where: { workspaceId: workspace.id } }),
      prisma.aiRequest.aggregate({ where: { workspaceId: workspace.id }, _sum: { inputTokens: true, outputTokens: true, estimatedCostCents: true } }),
      prisma.workflow.findMany({ where: { workspaceId: workspace.id, deletedAt: null }, include: { nodes: { orderBy: { sortOrder: "asc" } }, executions: true }, orderBy: { updatedAt: "desc" } }),
      prisma.agent.findMany({ where: { workspaceId: workspace.id, deletedAt: null }, orderBy: { updatedAt: "desc" } }),
      prisma.approvalRequest.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.contact.findMany({ where: { workspaceId: workspace.id, deletedAt: null }, orderBy: { updatedAt: "desc" }, take: 50 }),
      prisma.task.findMany({ where: { workspaceId: workspace.id }, include: { contact: true }, orderBy: { updatedAt: "desc" }, take: 50 }),
      prisma.auditLog.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" }, take: 30 }),
    ]);
    const totalDone = failed + completed;
    return {
      workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug, plan: workspace.plan, timezone: workspace.timezone },
      metrics: {
        activeWorkflows,
        successRate: totalDone ? completed / totalDone : 0,
        failureRate: totalDone ? failed / totalDone : 0,
        executionsThisMonth: executions.length,
        pendingApprovals,
        aiRequests,
        tokenConsumption: (aiUsage._sum.inputTokens ?? 0) + (aiUsage._sum.outputTokens ?? 0),
        estimatedAiCostCents: aiUsage._sum.estimatedCostCents ?? 0,
        savedStaffTimeMinutes: completed * 12,
        tasksCreated: tasks.length,
        contactsProcessed: contacts.length,
      },
      agents: agents.map((agent) => ({ id: agent.id, name: agent.name, status: agent.status, modelProvider: agent.modelProvider, modelName: agent.modelName, tools: toStringList(agent.toolPermissions), successRate: 0.96, lastExecution: executions[0]?.createdAt ?? null })),
      workflows: workflows.map((workflow) => {
        const done = workflow.executions.filter((execution) => execution.status === "COMPLETED" || execution.status === "FAILED");
        const wins = done.filter((execution) => execution.status === "COMPLETED").length;
        return { id: workflow.id, name: workflow.name, status: workflow.status, triggerType: workflow.triggerType, nodes: workflow.nodes, executions: workflow.executions.length, successRate: done.length ? wins / done.length : 0 };
      }),
      executions: executions.map((execution) => ({ id: execution.id, workflowName: execution.workflow.name, triggerType: execution.workflow.triggerType, status: execution.status, createdAt: execution.createdAt, durationMs: durationMs(execution.startedAt, execution.completedAt), steps: execution.steps.length })),
      approvals: approvals.map((approval) => ({ id: approval.id, requestedAction: approval.requestedAction, status: approval.status, riskLevel: approval.riskLevel, humanSummary: approval.humanSummary, createdAt: approval.createdAt, workflowName: workflows.find((workflow) => workflow.id === approval.workflowId)?.name ?? null })),
      contacts: contacts.map((contact) => ({ id: contact.id, firstName: contact.firstName, lastName: contact.lastName, email: contact.email, company: contact.company, status: contact.status, tags: contact.tags, updatedAt: contact.updatedAt })),
      tasks: tasks.map((task) => ({ id: task.id, title: task.title, status: task.status, priority: task.priority, dueDate: task.dueDate, contactName: task.contact ? `${task.contact.firstName} ${task.contact.lastName ?? ""}`.trim() : null, updatedAt: task.updatedAt })),
      activity: activity.map((log) => ({ id: log.id, action: log.action, entityType: log.entityType, result: log.result, createdAt: log.createdAt, details: `${log.action} on ${log.entityType}` })),
      recentErrors: executions.filter((execution) => execution.status === "FAILED").map((execution) => ({ id: execution.id, workflowName: execution.workflow.name, triggerType: execution.workflow.triggerType, status: execution.status, createdAt: execution.createdAt, durationMs: durationMs(execution.startedAt, execution.completedAt), steps: execution.steps.length })),
    };
  } catch {
    return fallbackOverview();
  }
}

export async function getExecutionDetail(executionId: string) {
  try {
    return await prisma.workflowExecution.findUnique({ where: { id: executionId }, include: { workflow: true, steps: { orderBy: { createdAt: "asc" } }, approvals: true, toolExecutions: true, aiRequests: true } });
  } catch {
    return null;
  }
}

function toStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function durationMs(startedAt: Date | null, completedAt: Date | null) {
  return startedAt && completedAt ? completedAt.getTime() - startedAt.getTime() : null;
}

export function fallbackOverview(): WorkspaceOverview {
  const workflows: OverviewWorkflow[] = [
    { id: "new_lead_assistant", name: "New lead assistant", status: "ACTIVE", triggerType: "manual/webhook", executions: 18, successRate: 0.94, nodes: [{ key: "trigger", type: "trigger", name: "Manual or webhook", sortOrder: 0 }, { key: "classify", type: "ai_agent", name: "Classify inquiry", sortOrder: 1 }, { key: "task", type: "create_task", name: "Create follow-up", sortOrder: 2 }, { key: "notify", type: "notification", name: "Notify team", sortOrder: 3 }] },
    { id: "weekly_business_report", name: "Weekly business report", status: "ACTIVE", triggerType: "schedule", executions: 5, successRate: 1, nodes: [{ key: "trigger", type: "trigger", name: "Monday 09:00", sortOrder: 0 }, { key: "agent", type: "ai_agent", name: "Summarize activity", sortOrder: 1 }, { key: "notify", type: "notification", name: "Notify owner", sortOrder: 2 }] },
    { id: "social_content_approval", name: "Social content approval", status: "ACTIVE", triggerType: "manual", executions: 7, successRate: 0.86, nodes: [{ key: "agent", type: "ai_agent", name: "Draft posts", sortOrder: 0 }, { key: "approval", type: "human_approval", name: "Approve content", sortOrder: 1 }] },
  ];
  const executions: OverviewExecution[] = [
    { id: "seed-1", workflowName: "New lead assistant", triggerType: "manual", status: "COMPLETED", createdAt: now, durationMs: 4200, steps: 5 },
    { id: "seed-2", workflowName: "Social content approval", triggerType: "manual", status: "WAITING_FOR_APPROVAL", createdAt: new Date("2026-07-24T10:10:00.000Z"), durationMs: null, steps: 2 },
    { id: "seed-3", workflowName: "Weekly business report", triggerType: "schedule", status: "COMPLETED", createdAt: new Date("2026-07-22T09:00:00.000Z"), durationMs: 7800, steps: 4 },
  ];
  return {
    workspace: { id: "demo_workspace", name: "Acme Operations", slug: "acme-operations", plan: "BUSINESS", timezone: "Africa/Nairobi" },
    metrics: { activeWorkflows: 3, successRate: 0.93, failureRate: 0.07, executionsThisMonth: 30, pendingApprovals: 1, aiRequests: 42, tokenConsumption: 18420, estimatedAiCostCents: 0, savedStaffTimeMinutes: 348, tasksCreated: 12, contactsProcessed: 9 },
    agents: [
      { id: "sales_follow-up_agent", name: "Sales Follow-up Agent", status: "ACTIVE", modelProvider: "mock", modelName: "mock-business-agent", tools: ["contacts.create", "tasks.create", "notifications.create"], successRate: 0.97, lastExecution: now },
      { id: "business_reporting_agent", name: "Business Reporting Agent", status: "ACTIVE", modelProvider: "mock", modelName: "mock-business-agent", tools: ["reports.generate", "notifications.create"], successRate: 1, lastExecution: new Date("2026-07-22T09:00:00.000Z") },
      { id: "social_content_agent", name: "Social Content Agent", status: "ACTIVE", modelProvider: "mock", modelName: "mock-business-agent", tools: ["notifications.create"], successRate: 0.91, lastExecution: new Date("2026-07-24T10:10:00.000Z") },
    ],
    workflows,
    executions,
    approvals: [{ id: "approval-1", requestedAction: "social.content.schedule", status: "PENDING", riskLevel: "medium", humanSummary: "Approve generated hotel campaign posts before scheduling.", createdAt: new Date("2026-07-24T10:12:00.000Z"), workflowName: "Social content approval" }],
    contacts: [{ id: "contact-1", firstName: "Amina", lastName: "Hassan", email: "amina@example.com", company: "Harbor View Hotel", status: "QUALIFIED", tags: ["hotel", "automation"], updatedAt: now }, { id: "contact-2", firstName: "Maya", lastName: "Stone", email: "maya@example.com", company: "Stone Labs", status: "CONTACTED", tags: ["lead"], updatedAt: new Date("2026-07-23T15:20:00.000Z") }],
    tasks: [{ id: "task-1", title: "Follow up with Amina about hotel automation", status: "TODO", priority: "HIGH", dueDate: new Date("2026-07-25T09:00:00.000Z"), contactName: "Amina Hassan", updatedAt: now }, { id: "task-2", title: "Review weekly operations report", status: "WAITING", priority: "MEDIUM", dueDate: null, contactName: null, updatedAt: new Date("2026-07-22T09:10:00.000Z") }],
    activity: [{ id: "act-1", action: "workflow.execution.completed", entityType: "WorkflowExecution", result: "SUCCESS", createdAt: now, details: "New lead assistant completed and created a follow-up task" }, { id: "act-2", action: "approval.requested", entityType: "ApprovalRequest", result: "SUCCESS", createdAt: new Date("2026-07-24T10:12:00.000Z"), details: "Social content requires review" }],
    recentErrors: [],
  };
}