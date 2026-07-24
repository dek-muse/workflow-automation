import { prisma } from "@/server/database/client";
import { requireWorkspaceMember } from "@/server/auth/session";
import { ok, fail } from "@/lib/api-response";

export async function GET(request: Request) {
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) return fail("BAD_REQUEST", "workspaceId is required.");

  try {
    await requireWorkspaceMember(workspaceId);
    const integrations = await prisma.integration.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
    });
    return ok(integrations);
  } catch (error) {
    return fail("FORBIDDEN", error instanceof Error ? error.message : "Access denied.", 403);
  }
}
