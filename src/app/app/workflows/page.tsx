export const dynamic = "force-dynamic";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, GitBranch, Play, Plus, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";
import { runNewLeadAssistantDemo } from "@/app/app/workflows/actions";

const nodeTypes = ["Trigger", "AI Agent", "Condition", "HTTP request", "Create task", "Update contact", "Notification", "Delay", "Human approval", "Transform data", "End workflow"];

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Workflow Builder" description="A reliable ordered-step editor foundation for production automations, with validation-ready node configuration and human approval support." actions={<><form action={runNewLeadAssistantDemo}><Button type="submit"><Play className="size-4" />Run New Lead demo</Button></form><Button asChild variant="outline"><Link href="/app/workflows/new"><Plus className="size-4" />New workflow</Link></Button></>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Workflows" value={String(data.workflows.length)} detail="Draft, active, and paused" /><Metric label="Active" value={String(data.metrics.activeWorkflows)} detail="Ready for triggers" /><Metric label="Executions" value={String(data.metrics.executionsThisMonth)} detail="Recent run volume" /><Metric label="Failure rate" value={`${Math.round(data.metrics.failureRate * 100)}%`} detail="Needs attention" tone={data.metrics.failureRate > 0.1 ? "bad" : "default"} /></div>
    <div className="grid gap-4 xl:grid-cols-[240px_1fr_320px]">
      <Card><CardHeader><CardTitle className="text-sm">Node palette</CardTitle></CardHeader><CardContent className="space-y-2">{nodeTypes.map((node) => <div key={node} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><Plus className="size-3 text-muted-foreground" />{node}</div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="size-4 text-primary" />Workflow templates and records</CardTitle></CardHeader><CardContent className="space-y-3">{data.workflows.map((workflow) => <Link href={`/app/workflows/${workflow.id}`} key={workflow.id} className="block rounded-lg border p-4 hover:bg-muted"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="font-semibold">{workflow.name}</div><div className="mt-1 text-sm text-muted-foreground">{workflow.triggerType} trigger · {workflow.nodes.length} ordered steps · {workflow.executions} runs</div></div><StatusBadge status={workflow.status} /></div><div className="mt-3 flex flex-wrap gap-2">{workflow.nodes.map((node, index) => <span key={node.key} className="rounded-md bg-muted px-2 py-1 text-xs">{index + 1}. {node.name}</span>)}</div></Link>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm">Validation panel</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex gap-2"><CheckCircle2 className="size-4 text-emerald-600" />Trigger exists</div><div className="flex gap-2"><CheckCircle2 className="size-4 text-emerald-600" />At least one action exists</div><div className="flex gap-2"><GitBranch className="size-4 text-primary" />Branch validation ready</div><div className="flex gap-2"><AlertTriangle className="size-4 text-amber-600" />HTTP nodes require SSRF guard and approval</div><div className="flex gap-2"><Clock className="size-4 text-primary" />Delay and resume state persisted by worker foundation</div><div className="rounded-md border bg-muted p-3"><div className="mb-2 font-medium">Selected node config</div><pre className="overflow-auto text-xs"><code>{JSON.stringify({ inputMapping: "message", approvalPolicy: "write_actions", retry: { attempts: 2 } }, null, 2)}</code></pre></div></CardContent></Card>
    </div>
  </PageFrame>;
}