import { z } from "zod";
import { createWorkspaceForUser, listUserWorkspaces } from "@/server/repositories/workspace.repository";
import { recordAudit } from "./audit.service";
export const createWorkspaceSchema = z.object({ name: z.string().min(2), slug: z.string().min(2).regex(/^[a-z0-9-]+$/), industry: z.string().optional(), timezone: z.string().default("UTC") });
export async function createWorkspace(userId: string, raw: unknown) { const input = createWorkspaceSchema.parse(raw); const workspace = await createWorkspaceForUser({ userId, ...input }); await recordAudit({ workspaceId: workspace.id, actorId: userId, action: "workspace.create", entityType: "Workspace", entityId: workspace.id, newData: { name: workspace.name, slug: workspace.slug } }); return workspace; }
export const getWorkspacesForUser = listUserWorkspaces;
