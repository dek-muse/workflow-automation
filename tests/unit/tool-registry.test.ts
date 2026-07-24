import { describe, expect, it } from "vitest";
import { executeTool, listTools } from "../../src/server/ai/tools/tool-registry";

describe("tool registry", () => {
  it("lists registered tools with approval metadata", () => { expect(listTools().some((tool) => tool.name === "http.request" && tool.approvalRequired)).toBe(true); });
  it("rejects write tools without execution permission", async () => { await expect(executeTool("tasks.create", { title: "Call lead" }, { workspaceId: "w1", role: "VIEWER" })).rejects.toThrow(/Missing permission/); });
  it("validates tool input before execution", async () => { await expect(executeTool("tasks.create", { title: "" }, { workspaceId: "w1", role: "OWNER" })).rejects.toThrow(); });
  it("validates approval-required HTTP input before pausing", async () => { await expect(executeTool("http.request", { url: "not-a-url" }, { workspaceId: "w1", role: "OWNER" })).rejects.toThrow(); });
  it("blocks local and private HTTP targets", async () => { await expect(executeTool("http.request", { url: "http://127.0.0.1:3000" }, { workspaceId: "w1", role: "OWNER" })).rejects.toThrow(/Private/); });
  it("pauses public HTTP targets for approval", async () => { await expect(executeTool("http.request", { url: "https://example.com", method: "POST" }, { workspaceId: "w1", role: "OWNER" })).resolves.toMatchObject({ paused: true, approvalRequired: true }); });
});