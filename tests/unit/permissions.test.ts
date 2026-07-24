import { describe, expect, it } from "vitest";
import { canApproveExecution, canCreateWorkflow, canManageWorkspace, hasPermission } from "../../src/server/permissions/permissions";
describe("workspace RBAC", () => {
  it("lets owners manage the workspace", () => { expect(canManageWorkspace("OWNER")).toBe(true); });
  it("lets automation managers create workflows but not approve executions", () => { expect(canCreateWorkflow("AUTOMATION_MANAGER")).toBe(true); expect(canApproveExecution("AUTOMATION_MANAGER")).toBe(false); });
  it("keeps viewers read-oriented", () => { expect(hasPermission("VIEWER", "analytics.view")).toBe(true); expect(hasPermission("VIEWER", "workflows.execute")).toBe(false); });
});
