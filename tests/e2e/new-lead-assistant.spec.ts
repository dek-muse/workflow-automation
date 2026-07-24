import { test, expect } from "@playwright/test";

test.describe("New Lead Assistant demo", () => {
  test.skip(process.env.RUN_E2E !== "1", "Requires RUN_E2E=1, local PostgreSQL/Redis, seeded data, and the dev server.");

  test("signs in, runs the demo, and opens execution-related pages", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@flowpilot.local");
    await page.getByLabel("Password").fill("FlowPilotDemo123!");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForURL(/\/app\/dashboard|\/onboarding/);
    await page.goto("/app/workflows");
    await page.getByRole("button", { name: /Run New Lead demo/i }).click();
    await page.goto("/app/executions");
    await expect(page.getByText("New lead assistant").first()).toBeVisible();
    await page.goto("/app/contacts");
    await expect(page.getByText(/Amina|Maya/).first()).toBeVisible();
    await page.goto("/app/tasks");
    await expect(page.getByText(/Follow up/i).first()).toBeVisible();
  });
});