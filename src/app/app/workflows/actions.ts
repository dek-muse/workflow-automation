"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/database/client";

const demoInput = {
  name: "Amina Hassan",
  email: "amina@example.com",
  message: "We need help automating customer follow-ups for our hotel.",
};

export async function runNewLeadAssistantDemo() {
  const workspace = await prisma.workspace.findFirst({ where: { deletedAt: null }, orderBy: { createdAt: "asc" } });
  if (!workspace) throw new Error("Create or seed a workspace before running the demo workflow.");
  let workflow = await prisma.workflow.findFirst({ where: { workspaceId: workspace.id, id: "new_lead_assistant" } });
  if (!workflow) {
    workflow = await prisma.workflow.create({ data: { id: "new_lead_assistant", workspaceId: workspace.id, name: "New lead assistant", triggerType: "manual", status: "ACTIVE" } });
    await prisma.workflowNode.createMany({ data: [
      { workflowId: workflow.id, key: "trigger", type: "trigger", name: "Manual lead input", sortOrder: 0 },
      { workflowId: workflow.id, key: "classify", type: "ai_agent", name: "Classify inquiry", sortOrder: 1 },
      { workflowId: workflow.id, key: "contact", type: "contacts.create", name: "Create or update contact", sortOrder: 2 },
      { workflowId: workflow.id, key: "task", type: "tasks.create", name: "Create follow-up task", sortOrder: 3 },
      { workflowId: workflow.id, key: "notify", type: "notifications.create", name: "Notify team", sortOrder: 4 },
    ] });
  }
  const startedAt = new Date();
  const execution = await prisma.workflowExecution.create({ data: { workspaceId: workspace.id, workflowId: workflow.id, idempotencyKey: `demo-${Date.now()}`, status: "RUNNING", input: demoInput, startedAt } });
  const classification = { intent: "sales_follow_up", urgency: "high", industry: "hotel_and_hospitality", suggestedNextAction: "Book a discovery call and map guest follow-up workflows.", confidence: 0.94 };
  const existingContact = await prisma.contact.findFirst({ where: { workspaceId: workspace.id, email: demoInput.email } });
  const [firstName, ...rest] = demoInput.name.split(" ");
  const contact = existingContact ? await prisma.contact.update({ where: { id: existingContact.id }, data: { firstName, lastName: rest.join(" ") || null, status: "QUALIFIED", tags: ["hotel", "automation", "demo"], notes: demoInput.message } }) : await prisma.contact.create({ data: { workspaceId: workspace.id, firstName, lastName: rest.join(" ") || null, email: demoInput.email, company: "Harbor View Hotel", status: "QUALIFIED", tags: ["hotel", "automation", "demo"], notes: demoInput.message, source: "Demo workflow" } });
  const task = await prisma.task.create({ data: { workspaceId: workspace.id, title: "Follow up with Amina about hotel automation", description: classification.suggestedNextAction, priority: "HIGH", status: "TODO", contactId: contact.id, workflowId: workflow.id, executionId: execution.id } });
  await prisma.notification.create({ data: { workspaceId: workspace.id, type: "WORKFLOW_COMPLETED", title: "New lead assistant completed", body: `Created ${contact.firstName} and follow-up task: ${task.title}`, metadata: { executionId: execution.id, contactId: contact.id, taskId: task.id } } });
  await prisma.aiRequest.create({ data: { workspaceId: workspace.id, executionId: execution.id, provider: "mock", model: "mock-business-agent", inputTokens: 120, outputTokens: 80, estimatedCostCents: 0, request: demoInput, response: classification } });
  await prisma.workflowStepExecution.createMany({ data: [
    { executionId: execution.id, nodeKey: "trigger", nodeType: "trigger", status: "COMPLETED", input: demoInput, output: demoInput, startedAt, completedAt: new Date() },
    { executionId: execution.id, nodeKey: "classify", nodeType: "ai_agent", status: "COMPLETED", input: demoInput, output: classification, startedAt, completedAt: new Date() },
    { executionId: execution.id, nodeKey: "contact", nodeType: "contacts.create", status: "COMPLETED", input: classification, output: { contactId: contact.id }, startedAt, completedAt: new Date() },
    { executionId: execution.id, nodeKey: "task", nodeType: "tasks.create", status: "COMPLETED", input: { contactId: contact.id }, output: { taskId: task.id }, startedAt, completedAt: new Date() },
    { executionId: execution.id, nodeKey: "notify", nodeType: "notifications.create", status: "COMPLETED", input: { taskId: task.id }, output: { notified: true }, startedAt, completedAt: new Date() },
  ] });
  await prisma.usageRecord.create({ data: { workspaceId: workspace.id, metric: "workflow_executions", quantity: 1, unit: "count", periodStart: new Date("2026-07-01"), periodEnd: new Date("2026-08-01"), metadata: { workflowId: workflow.id, executionId: execution.id } } });
  await prisma.auditLog.create({ data: { workspaceId: workspace.id, action: "workflow.demo.new_lead.completed", entityType: "WorkflowExecution", entityId: execution.id, result: "SUCCESS", newData: { contactId: contact.id, taskId: task.id, classification } } });
  await prisma.workflowExecution.update({ where: { id: execution.id }, data: { status: "COMPLETED", output: { classification, contactId: contact.id, taskId: task.id }, completedAt: new Date() } });
  revalidatePath("/app/dashboard");
  revalidatePath("/app/workflows");
  revalidatePath("/app/executions");
}