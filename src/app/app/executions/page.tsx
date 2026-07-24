export const dynamic = "force-dynamic";
import Link from "next/link";
import { Clock, Filter, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Executions" description="Inspect workflow runs, statuses, step counts, timings, and trace-ready records." actions={<Button variant="outline"><Filter className="size-4" />Filters</Button>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Total runs" value={String(data.metrics.executionsThisMonth)} detail="Recent workspace executions" /><Metric label="Completed" value={String(data.executions.filter((item) => item.status === "COMPLETED").length)} detail="Successful runs" tone="good" /><Metric label="Waiting" value={String(data.executions.filter((item) => item.status === "WAITING_FOR_APPROVAL").length)} detail="Paused for approvals" tone="warn" /><Metric label="Failed" value={String(data.recentErrors.length)} detail="Needs operator review" tone={data.recentErrors.length ? "bad" : "default"} /></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="size-4 text-primary" />Execution list</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Workflow</th><th>Trigger</th><th>Status</th><th>Steps</th><th>Duration</th><th>Started</th></tr></thead><tbody>{data.executions.map((execution) => <tr key={execution.id} className="border-t"><td className="py-3"><Link className="font-medium hover:underline" href={`/app/executions/${execution.id}`}>{execution.workflowName}</Link></td><td>{execution.triggerType}</td><td><StatusBadge status={execution.status} /></td><td>{execution.steps}</td><td>{execution.durationMs ? `${(execution.durationMs / 1000).toFixed(1)}s` : "Open"}</td><td className="text-muted-foreground">{execution.createdAt.toLocaleString()}</td></tr>)}</tbody></table></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="size-4 text-primary" />Trace filters</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm md:grid-cols-5"><div className="rounded-md border p-3">Status</div><div className="rounded-md border p-3">Workflow</div><div className="rounded-md border p-3">Agent</div><div className="rounded-md border p-3">Date range</div><div className="rounded-md border p-3">Trigger type</div></CardContent></Card>
  </PageFrame>;
}