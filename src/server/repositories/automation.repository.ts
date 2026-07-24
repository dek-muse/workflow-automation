import { prisma } from "@/server/database/client";
export function listAgents(workspaceId: string) { return prisma.agent.findMany({ where: { workspaceId, deletedAt: null }, orderBy: { updatedAt: "desc" } }); }
export function listWorkflows(workspaceId: string) { return prisma.workflow.findMany({ where: { workspaceId, deletedAt: null }, include: { nodes: { orderBy: { sortOrder: "asc" } } }, orderBy: { updatedAt: "desc" } }); }
export function listExecutions(workspaceId: string) { return prisma.workflowExecution.findMany({ where: { workspaceId }, include: { workflow: true }, orderBy: { createdAt: "desc" }, take: 50 }); }
