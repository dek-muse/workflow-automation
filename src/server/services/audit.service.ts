import { prisma } from "@/server/database/client";
import type { AuditResult } from "@prisma/client";
export async function recordAudit(input: { workspaceId?: string; actorId?: string; action: string; entityType: string; entityId?: string; previousData?: unknown; newData?: unknown; ipAddress?: string; userAgent?: string; result?: AuditResult }) {
  return prisma.auditLog.create({ data: { ...input, result: input.result ?? "SUCCESS", previousData: input.previousData === undefined ? undefined : input.previousData as object, newData: input.newData === undefined ? undefined : input.newData as object } });
}
