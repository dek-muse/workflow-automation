export const dynamic = "force-dynamic";
import { CheckSquare, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Tasks" description="Operational follow-ups created by users and automations, linked back to contacts, workflows, and executions." actions={<><Button variant="outline"><Filter className="size-4" />Filters</Button><Button><Plus className="size-4" />New task</Button></>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Tasks" value={String(data.tasks.length)} detail="Open and completed" /><Metric label="High priority" value={String(data.tasks.filter((task) => task.priority === "HIGH" || task.priority === "URGENT").length)} detail="Needs focus" tone="warn" /><Metric label="Todo" value={String(data.tasks.filter((task) => task.status === "TODO").length)} detail="Ready to start" /><Metric label="Created" value={String(data.metrics.tasksCreated)} detail="From workspace data" /></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckSquare className="size-4 text-primary" />Task board</CardTitle></CardHeader><CardContent className="grid gap-3 lg:grid-cols-3">{["TODO", "WAITING", "COMPLETED"].map((status) => <div key={status} className="rounded-lg border bg-background p-3"><div className="mb-3 text-sm font-semibold">{status.replaceAll("_", " ")}</div><div className="space-y-2">{data.tasks.filter((task) => task.status === status).map((task) => <div key={task.id} className="rounded-md border bg-card p-3 text-sm"><div className="font-medium">{task.title}</div><div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={task.priority} /><span className="text-xs text-muted-foreground">{task.contactName ?? "No contact"}</span></div></div>)}</div></div>)}</CardContent></Card>
  </PageFrame>;
}