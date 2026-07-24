import { prisma } from "@/server/database/client";
import { requireWorkspaceMember } from "@/server/auth/session";
import { ok, fail } from "@/lib/api-response";

export async function GET(request: Request) {
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) return fail("BAD_REQUEST", "workspaceId is required.");

  try {
    await requireWorkspaceMember(workspaceId);
    const approvals = await prisma.approvalRequest.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok(approvals);
  } catch (error) {
    return fail("FORBIDDEN", error instanceof Error ? error.message : "Access denied.", 403);
  }
}
