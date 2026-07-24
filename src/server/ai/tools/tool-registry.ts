import { z } from "zod";
import { ForbiddenError } from "@/server/errors";
import type { Permission } from "@/server/permissions/permissions";
import { hasPermission } from "@/server/permissions/permissions";
import type { WorkspaceRole } from "@prisma/client";

export type ToolContext = { workspaceId: string; actorId?: string; role: WorkspaceRole };
export type ToolDefinition<I, O> = { name: string; description: string; inputSchema: z.ZodType<I>; outputSchema: z.ZodType<O>; requiredPermissions: Permission[]; readOnly: boolean; destructive: boolean; approvalRequired: boolean; timeoutMs: number; retryPolicy: { attempts: number }; handler: (input: I, context: ToolContext) => Promise<O> };

const taskInput = z.object({ title: z.string().min(1), description: z.string().optional(), priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM") });
const httpInput = z.object({ url: z.string().url().refine((url) => isPublicHttpTarget(url), "Private, local, and non-http targets are blocked."), method: z.enum(["GET", "POST"]).default("GET"), headers: z.record(z.string()).optional(), body: z.unknown().optional(), timeoutMs: z.number().int().min(100).max(10000).optional() });
const simpleOut = z.object({ ok: z.boolean(), id: z.string().optional(), message: z.string().optional() });
const registry = new Map<string, ToolDefinition<unknown, unknown>>();

function register<I, O>(tool: ToolDefinition<I, O>) { registry.set(tool.name, tool as ToolDefinition<unknown, unknown>); }

register({ name: "workspace.get_context", description: "Read workspace context", inputSchema: z.object({}), outputSchema: z.object({ workspaceId: z.string() }), requiredPermissions: ["analytics.view"], readOnly: true, destructive: false, approvalRequired: false, timeoutMs: 5000, retryPolicy: { attempts: 1 }, handler: async (_input, ctx) => ({ workspaceId: ctx.workspaceId }) });
for (const name of ["contacts.list", "tasks.list", "reports.generate", "notifications.create", "workflow.get_status"] as const) register({ name, description: `Foundation tool ${name}`, inputSchema: z.record(z.unknown()), outputSchema: simpleOut, requiredPermissions: ["workflows.execute"], readOnly: !name.includes("create"), destructive: false, approvalRequired: false, timeoutMs: 10000, retryPolicy: { attempts: 2 }, handler: async () => ({ ok: true, message: "Mock-safe foundation action completed." }) });
for (const name of ["contacts.create", "contacts.update", "tasks.create", "tasks.update", "workflow.trigger"] as const) register({ name, description: `Write tool ${name}`, inputSchema: name === "tasks.create" ? taskInput : z.record(z.unknown()), outputSchema: simpleOut, requiredPermissions: ["workflows.execute"], readOnly: false, destructive: false, approvalRequired: false, timeoutMs: 10000, retryPolicy: { attempts: 2 }, handler: async () => ({ ok: true, id: crypto.randomUUID() }) });
register({ name: "http.request", description: "Validated outbound HTTP request foundation with SSRF policy boundary", inputSchema: httpInput, outputSchema: simpleOut, requiredPermissions: ["integrations.manage"], readOnly: false, destructive: true, approvalRequired: true, timeoutMs: 10000, retryPolicy: { attempts: 1 }, handler: async () => ({ ok: false, message: "External HTTP execution requires configured approval and network egress policy." }) });

export function listTools() { return [...registry.values()].map((tool) => { const clone = { ...tool } as Partial<typeof tool>; delete clone.handler; return clone; }); }

export async function executeTool(name: string, rawInput: unknown, context: ToolContext) {
  const tool = registry.get(name);
  if (!tool) throw new ForbiddenError("Tool is not registered.");
  for (const permission of tool.requiredPermissions) if (!hasPermission(context.role, permission)) throw new ForbiddenError(`Missing permission ${permission}.`);
  const input = tool.inputSchema.parse(rawInput);
  if (tool.approvalRequired) return { paused: true, approvalRequired: true, tool: name, input, destructive: tool.destructive };
  return tool.outputSchema.parse(await tool.handler(input, context));
}

function isPublicHttpTarget(rawUrl: string) {
  let url: URL;
  try { url = new URL(rawUrl); } catch { return false; }
  if (!["http:", "https:"].includes(url.protocol)) return false;
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "0.0.0.0") return false;
  if (hostname.startsWith("127.") || hostname.startsWith("10.") || hostname.startsWith("192.168.")) return false;
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) {
    const [a, b] = parts;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 169 && b === 254) return false;
  }
  if (hostname === "::1" || hostname.startsWith("fc") || hostname.startsWith("fd") || hostname.startsWith("fe80")) return false;
  return true;
}