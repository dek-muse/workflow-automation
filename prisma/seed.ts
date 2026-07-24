import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const demoPassword = "FlowPilotDemo123!";

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const demoUsers = [
    { id: "demo_owner", email: "demo@flowpilot.local", name: "Demo Owner", role: "OWNER" as const },
    { id: "demo_admin", email: "admin@flowpilot.local", name: "Asha Admin", role: "ADMIN" as const },
    { id: "demo_manager", email: "manager@flowpilot.local", name: "Omar Automation", role: "AUTOMATION_MANAGER" as const },
    { id: "demo_approver", email: "approver@flowpilot.local", name: "Muna Approver", role: "APPROVER" as const },
    { id: "demo_analyst", email: "analyst@flowpilot.local", name: "Noah Analyst", role: "ANALYST" as const },
    { id: "demo_viewer", email: "viewer@flowpilot.local", name: "Lina Viewer", role: "VIEWER" as const },
  ];

  const users = [];
  for (const demoUser of demoUsers) {
    users.push(await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { name: demoUser.name, passwordHash, emailVerified: new Date() },
      create: { id: demoUser.id, email: demoUser.email, name: demoUser.name, passwordHash, emailVerified: new Date() },
    }));
  }
  const owner = users[0];

  const workspace = await prisma.workspace.upsert({
    where: { slug: "acme-operations" },
    update: { plan: "BUSINESS", usageLimits: { activeWorkflows: 25, monthlyExecutions: 5000, aiRequests: 10000 }, settings: { approvalMode: "risk-based" } },
    create: {
      id: "demo_workspace",
      name: "Acme Operations",
      slug: "acme-operations",
      industry: "Professional Services",
      timezone: "Africa/Nairobi",
      defaultLanguage: "en",
      plan: "BUSINESS",
      usageLimits: { activeWorkflows: 25, monthlyExecutions: 5000, aiRequests: 10000 },
      settings: { approvalMode: "risk-based" },
    },
  });

  await prisma.subscription.upsert({
    where: { workspaceId: workspace.id },
    update: { plan: "BUSINESS", status: "active" },
    create: { workspaceId: workspace.id, plan: "BUSINESS", status: "active" },
  });

  for (const demoUser of demoUsers) {
    await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: demoUser.id } },
      update: { role: demoUser.role },
      create: { workspaceId: workspace.id, userId: demoUser.id, role: demoUser.role },
    });
  }

  const templates = ["Customer Support Agent", "Sales Follow-up Agent", "Social Content Agent", "Business Reporting Agent", "Document Processing Agent", "Operations Assistant"];
  for (const name of templates) {
    await prisma.agent.upsert({
      where: { id: name.toLowerCase().replaceAll(" ", "_") },
      update: {},
      create: { id: name.toLowerCase().replaceAll(" ", "_"), workspaceId: workspace.id, name, purpose: `${name} template`, description: "Initial production-ready template", systemInstructions: `Act as the ${name}. Use only allowed tools and request approval for sensitive actions.`, status: name.includes("Document") ? "DRAFT" : "ACTIVE", createdById: owner.id, toolPermissions: ["workspace.get_context", "tasks.create", "contacts.create", "notifications.create"] },
    });
  }

  const workflowData = [
    { id: "new_lead_assistant", name: "New lead assistant", triggerType: "webhook", nodes: ["ai_agent", "create_task", "notification"] },
    { id: "weekly_business_report", name: "Weekly business report", triggerType: "schedule", nodes: ["ai_agent", "notification"] },
    { id: "social_content_approval", name: "Social content approval", triggerType: "manual", nodes: ["ai_agent", "human_approval", "notification"] },
    { id: "customer_support_triage", name: "Customer support triage", triggerType: "webhook", nodes: ["ai_agent", "create_task", "notification"] },
    { id: "overdue_task_reminder", name: "Overdue task reminder", triggerType: "schedule", nodes: ["condition", "notification"] },
  ];

  for (const wf of workflowData) {
    const triggerConfig = wf.triggerType === "schedule" ? { cron: "0 9 * * 1" } : {};
    const workflow = await prisma.workflow.upsert({
      where: { id: wf.id },
      update: { name: wf.name, triggerType: wf.triggerType, status: "ACTIVE", triggerConfig },
      create: { id: wf.id, workspaceId: workspace.id, name: wf.name, triggerType: wf.triggerType, status: "ACTIVE", triggerConfig },
    });
    await prisma.workflowNode.deleteMany({ where: { workflowId: workflow.id } });
    await prisma.workflowNode.createMany({ data: wf.nodes.map((type, index) => ({ workflowId: workflow.id, key: `node_${index + 1}`, type, name: type.replaceAll("_", " "), sortOrder: index, config: {} })) });
  }

  await prisma.approvalRequest.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.notification.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.aiRequest.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.usageRecord.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.auditLog.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.task.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.contact.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.workflowExecution.deleteMany({ where: { workspaceId: workspace.id } });

  await prisma.contact.createMany({ data: [
    { workspaceId: workspace.id, firstName: "Maya", lastName: "Stone", email: "maya@example.com", company: "Stone Labs", status: "QUALIFIED", tags: ["lead", "priority"] },
    { workspaceId: workspace.id, firstName: "Theo", lastName: "Kim", email: "theo@example.com", company: "Northstar", status: "CONTACTED", tags: ["newsletter"] },
    { workspaceId: workspace.id, firstName: "Amina", lastName: "Hassan", email: "amina@example.com", company: "Harbor View Hotel", status: "NEW", tags: ["hotel", "demo"] },
  ] });

  await prisma.task.createMany({ data: [
    { workspaceId: workspace.id, title: "Follow up with Maya", priority: "HIGH", status: "TODO", createdById: owner.id },
    { workspaceId: workspace.id, title: "Review weekly report", priority: "MEDIUM", status: "WAITING", createdById: owner.id },
    { workspaceId: workspace.id, title: "Prepare hotel automation demo", priority: "HIGH", status: "IN_PROGRESS", createdById: owner.id },
  ] });

  await prisma.workflowExecution.createMany({ data: [
    { workspaceId: workspace.id, workflowId: "new_lead_assistant", idempotencyKey: "seed-1", status: "COMPLETED", input: { inquiry: "Need pricing" }, output: { taskCreated: true }, startedAt: new Date(), completedAt: new Date() },
    { workspaceId: workspace.id, workflowId: "social_content_approval", idempotencyKey: "seed-2", status: "WAITING_FOR_APPROVAL", input: { topic: "July campaign" } },
    { workspaceId: workspace.id, workflowId: "weekly_business_report", idempotencyKey: "seed-3", status: "COMPLETED", input: { week: "2026-W30" }, output: { report: true }, startedAt: new Date(), completedAt: new Date() },
  ] });

  const waitingExecution = await prisma.workflowExecution.findFirst({ where: { workflowId: "social_content_approval", idempotencyKey: "seed-2" } });
  await prisma.approvalRequest.create({ data: { workspaceId: workspace.id, executionId: waitingExecution?.id, workflowId: "social_content_approval", requestedAction: "social.content.schedule", inputPayload: { topic: "July campaign" }, humanSummary: "Approve generated social content before scheduling.", riskLevel: "medium", requestedById: owner.id } });
  await prisma.approvalRequest.create({ data: { workspaceId: workspace.id, workflowId: "new_lead_assistant", requestedAction: "lead.followup.create", inputPayload: { lead: "Maya Stone" }, humanSummary: "Previously approved follow-up task creation.", riskLevel: "low", requestedById: owner.id, status: "APPROVED", decidedById: demoUsers[3].id, decidedAt: new Date(), reviewerNotes: "Looks safe." } });

  await prisma.notification.create({ data: { workspaceId: workspace.id, userId: owner.id, type: "APPROVAL_REQUIRED", title: "Approval required", body: "Social content approval is waiting for review." } });
  await prisma.notification.create({ data: { workspaceId: workspace.id, userId: demoUsers[3].id, type: "WORKFLOW_COMPLETED", title: "Workflow completed", body: "New lead assistant completed successfully." } });

  await prisma.aiRequest.create({ data: { workspaceId: workspace.id, provider: "mock", model: "mock-business-agent", inputTokens: 120, outputTokens: 80, estimatedCostCents: 0, request: { task: "Classify lead" }, response: { intent: "sales_follow_up" } } });
  await prisma.usageRecord.createMany({ data: [
    { workspaceId: workspace.id, metric: "workflow_executions", quantity: 42, unit: "count", periodStart: new Date("2026-07-01"), periodEnd: new Date("2026-08-01") },
    { workspaceId: workspace.id, metric: "ai_tokens", quantity: 18420, unit: "tokens", periodStart: new Date("2026-07-01"), periodEnd: new Date("2026-08-01") },
  ] });
  await prisma.auditLog.create({ data: { workspaceId: workspace.id, actorId: owner.id, action: "seed.demo", entityType: "Workspace", entityId: workspace.id, result: "SUCCESS", newData: { demo: true } } });
}

main().finally(async () => prisma.$disconnect());