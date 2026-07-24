"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/server/database/client";
import { requireWorkspaceMember } from "@/server/auth/session";
import { hasPermission } from "@/server/permissions/permissions";
import { ForbiddenError } from "@/server/errors";
import { redactSensitive } from "@/server/services/redaction.service";

const decisionSchema = z.object({ approvalId: z.string().min(1), decision: z.enum(["APPROVED", "REJECTED"]), reviewerNotes: z.string().max(1000).optional() });

export async function decideApproval(formData: FormData) {
  const input = decisionSchema.parse({ approvalId: formData.get("approvalId"), decision: formData.get("decision"), reviewerNotes: formData.get("reviewerNotes") });
  const approval = await prisma.approvalRequest.findUniqueOrThrow({ where: { id: input.approvalId } });
  const { user, member } = await requireWorkspaceMember(approval.workspaceId);
  if (!hasPermission(member.role, "approvals.manage")) throw new ForbiddenError("Approval permission required.");
  if (approval.status !== "PENDING") throw new Error("Approval has already been decided.");
  if (approval.expiresAt && approval.expiresAt < new Date()) throw new Error("Approval request has expired.");
  await prisma.$transaction(async (tx) => {
    await tx.approvalRequest.update({ where: { id: approval.id }, data: { status: input.decision, decidedById: user.id, decidedAt: new Date(), reviewerNotes: input.reviewerNotes } });
    if (approval.executionId) {
      await tx.workflowExecution.update({ where: { id: approval.executionId }, data: { status: input.decision === "APPROVED" ? "COMPLETED" : "CANCELLED", completedAt: new Date(), output: input.decision === "APPROVED" ? { approval: "approved" } : undefined, error: input.decision === "REJECTED" ? { approval: "rejected" } : undefined } });
    }
    await tx.auditLog.create({ data: { workspaceId: approval.workspaceId, actorId: user.id, action: `approval.${input.decision.toLowerCase()}`, entityType: "ApprovalRequest", entityId: approval.id, previousData: redactSensitive({ status: approval.status, inputPayload: approval.inputPayload }) as object, newData: redactSensitive({ status: input.decision, reviewerNotes: input.reviewerNotes }) as object, result: "SUCCESS" } });
  });
  revalidatePath("/app/approvals");
  revalidatePath("/app/executions");
}