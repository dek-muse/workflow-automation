import { ok, fail } from "@/lib/api-response";
import { prisma } from "@/server/database/client";

export async function GET() {
  try {
    await prisma.user.findFirst({ select: { id: true } });
    return ok({ status: "ready" });
  } catch {
    return fail("NOT_READY", "Database readiness check failed.", 503);
  }
}
