export const dynamic = "force-dynamic";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  const bars = data.workflows.map((workflow) => ({ label: workflow.name, value: Math.round(workflow.successRate * 100) }));
  return <PageFrame title="Analytics" description="Database-backed operational metrics for workflows, AI requests, approvals, CRM throughput, and saved staff time.">
    <div className="grid gap-3 md:grid-cols-5"><Metric label="Executions" value={String(data.metrics.executionsThisMonth)} detail="Recent total" /><Metric label="Success" value={`${Math.round(data.metrics.successRate * 100)}%`} detail="Completion rate" tone="good" /><Metric label="Failure" value={`${Math.round(data.metrics.failureRate * 100)}%`} detail="Failure rate" /><Metric label="Tokens" value={data.metrics.tokenConsumption.toLocaleString()} detail="AI usage" /><Metric label="Cost" value={`$${(data.metrics.estimatedAiCostCents / 100).toFixed(2)}`} detail="Estimated AI cost" /></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="size-4 text-primary" />Workflow success</CardTitle></CardHeader><CardContent className="space-y-4">{bars.map((bar) => <div key={bar.label}><div className="mb-1 flex justify-between text-sm"><span>{bar.label}</span><span>{bar.value}%</span></div><div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${bar.value}%` }} /></div></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Usage mix</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm"><div className="rounded-md border p-3">AI requests: {data.metrics.aiRequests}</div><div className="rounded-md border p-3">Approval requests: {data.approvals.length}</div><div className="rounded-md border p-3">Contacts processed: {data.metrics.contactsProcessed}</div><div className="rounded-md border p-3">Tasks created: {data.metrics.tasksCreated}</div></CardContent></Card></div>
  </PageFrame>;
}