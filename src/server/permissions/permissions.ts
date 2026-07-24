import type { WorkspaceRole } from "@prisma/client";
export type Permission = "workspace.manage" | "members.manage" | "integrations.manage" | "agents.create" | "workflows.create" | "workflows.execute" | "approvals.manage" | "analytics.view" | "billing.view" | "audit.view";
const rolePermissions: Record<WorkspaceRole, Permission[]> = {
  OWNER: ["workspace.manage", "members.manage", "integrations.manage", "agents.create", "workflows.create", "workflows.execute", "approvals.manage", "analytics.view", "billing.view", "audit.view"],
  ADMIN: ["workspace.manage", "members.manage", "integrations.manage", "agents.create", "workflows.create", "workflows.execute", "approvals.manage", "analytics.view", "billing.view", "audit.view"],
  AUTOMATION_MANAGER: ["integrations.manage", "agents.create", "workflows.create", "workflows.execute", "analytics.view"],
  APPROVER: ["approvals.manage", "analytics.view"],
  OPERATOR: ["workflows.execute"],
  ANALYST: ["analytics.view", "audit.view"],
  VIEWER: ["analytics.view"]
};
export function hasPermission(role: WorkspaceRole, permission: Permission) { return rolePermissions[role].includes(permission); }
export const canManageWorkspace = (role: WorkspaceRole) => hasPermission(role, "workspace.manage");
export const canCreateWorkflow = (role: WorkspaceRole) => hasPermission(role, "workflows.create");
export const canApproveExecution = (role: WorkspaceRole) => hasPermission(role, "approvals.manage");
export const canViewAnalytics = (role: WorkspaceRole) => hasPermission(role, "analytics.view");
export const canManageIntegrations = (role: WorkspaceRole) => hasPermission(role, "integrations.manage");
