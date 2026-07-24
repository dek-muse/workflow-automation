export const dynamic = "force-dynamic";
import { AlertTriangle, CheckCircle2, MoreHorizontal, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";
import { runNewLeadAssistantDemo } from "@/app/app/workflows/actions";

export default async function Page({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = await params;
  const data = await getWorkspaceOverview();
  const workflow = data.workflows.find((item) => item.id === workflowId) ?? data.workflows[0];
  return <PageFrame title={workflow.name} description="Ordered workflow editor with step configuration, validation, status controls, and test execution." actions={<><Button variant="outline"><Save className="size-4" />Saved</Button><form action={runNewLeadAssistantDemo}><Button type="submit"><Play className="size-4" />Test</Button></form><Button variant="outline"><MoreHorizontal className="size-4" /></Button></>}>
    <div className="grid gap-4 xl:grid-cols-[240px_1fr_320px]"><Card><CardHeader><CardTitle>Node types</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{["Trigger", "AI Agent", "Condition", "HTTP request", "Create task", "Update contact", "Notification", "Delay", "Human approval", "End"].map((node) => <div className="rounded-md border p-2" key={node}>{node}</div>)}</CardContent></Card><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Ordered steps</CardTitle><StatusBadge status={workflow.status} /></div></CardHeader><CardContent className="space-y-3">{workflow.nodes.map((node, index) => <div key={node.key} className="grid grid-cols-[32px_1fr] gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{index + 1}</div><div className="rounded-md border p-3"><div className="font-medium">{node.name}</div><div className="text-xs text-muted-foreground">{node.type}</div></div></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Validation</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex gap-2"><CheckCircle2 className="size-4 text-emerald-600" />Trigger configured</div><div className="flex gap-2"><CheckCircle2 className="size-4 text-emerald-600" />Action steps present</div><div className="flex gap-2"><AlertTriangle className="size-4 text-amber-600" />External HTTP requires approval and SSRF guard</div><pre className="overflow-auto rounded-md bg-muted p-3 text-xs"><code>{JSON.stringify({ triggerType: workflow.triggerType, retryPolicy: { attempts: 2 }, branches: "linear" }, null, 2)}</code></pre></CardContent></Card></div>
  </PageFrame>;
}