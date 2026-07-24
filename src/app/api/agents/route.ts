import { listAgents } from "@/server/repositories/automation.repository";
import { requireWorkspaceMember } from "@/server/auth/session";
import { ok, fail } from "@/lib/api-response";

export async function GET(request: Request) {
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  if (!workspaceId) return fail("BAD_REQUEST", "workspaceId is required.");

  try {
    await requireWorkspaceMember(workspaceId);
    return ok(await listAgents(workspaceId));
  } catch (error) {
    return fail("FORBIDDEN", error instanceof Error ? error.message : "Access denied.", 403);
  }
}
