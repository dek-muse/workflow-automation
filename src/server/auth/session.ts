import { auth } from "./auth";
import { prisma } from "@/server/database/client";
import { ForbiddenError } from "@/server/errors";
export async function requireUser() { const session = await auth(); if (!session?.user?.email) throw new ForbiddenError("Authentication required."); const user = await prisma.user.findUnique({ where: { email: session.user.email } }); if (!user) throw new ForbiddenError("Authentication required."); return user; }
export async function requireWorkspaceMember(workspaceId: string) { const user = await requireUser(); const member = await prisma.workspaceMember.findUnique({ where: { workspaceId_userId: { workspaceId, userId: user.id } } }); if (!member) throw new ForbiddenError("Workspace access denied."); return { user, member }; }
