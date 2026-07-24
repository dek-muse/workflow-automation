import { WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Billing Settings" description="Billing-ready plan and usage foundation. No payment provider is simulated without credentials.">
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Plan" value={data.workspace.plan} detail="Workspace subscription plan" /><Metric label="Workflows" value={String(data.metrics.activeWorkflows)} detail="Active automation usage" /><Metric label="AI tokens" value={data.metrics.tokenConsumption.toLocaleString()} detail="Monthly AI usage" /><Metric label="Cost" value={`$${(data.metrics.estimatedAiCostCents / 100).toFixed(2)}`} detail="Estimated AI cost" /></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><WalletCards className="size-4 text-primary" />Provider boundary</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm md:grid-cols-3"><div className="rounded-md border p-3">Plans: Free, Starter, Business, Agency.</div><div className="rounded-md border p-3">Usage records are workspace-scoped.</div><div className="rounded-md border p-3">Stripe or another billing provider can be connected through the billing service abstraction.</div></CardContent></Card>
  </PageFrame>;
}