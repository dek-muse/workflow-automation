import { requireUser } from "@/server/auth/session";
import { createWorkspace, getWorkspacesForUser } from "@/server/services/workspace.service";
import { ok, fail } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await requireUser();
    return ok(await getWorkspacesForUser(user.id));
  } catch (error) {
    return fail("FORBIDDEN", error instanceof Error ? error.message : "Authentication required.", 403);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    return ok(await createWorkspace(user.id, await request.json()), { status: 201 });
  } catch (error) {
    return fail("BAD_REQUEST", error instanceof Error ? error.message : "Workspace could not be created.");
  }
}
