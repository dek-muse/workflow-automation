import { prisma } from "@/server/database/client";

export async function listUserWorkspaces(userId: string) {
  return prisma.workspace.findMany({ where: { members: { some: { userId } }, deletedAt: null }, include: { members: true }, orderBy: { createdAt: "asc" } });
}

export async function createWorkspaceForUser(input: { userId: string; name: string; slug: string; industry?: string; timezone?: string }) {
  const workspace = await prisma.workspace.create({ data: { name: input.name, slug: input.slug, industry: input.industry, timezone: input.timezone ?? "UTC" } });
  await prisma.workspaceMember.create({ data: { workspaceId: workspace.id, userId: input.userId, role: "OWNER" } });
  await prisma.subscription.create({ data: { workspaceId: workspace.id, plan: "FREE", status: "active" } });
  return prisma.workspace.findUniqueOrThrow({ where: { id: workspace.id }, include: { members: true } });
}

export async function getWorkspaceForUser(workspaceId: string, userId: string) {
  return prisma.workspace.findFirst({ where: { id: workspaceId, deletedAt: null, members: { some: { userId } } } });
}