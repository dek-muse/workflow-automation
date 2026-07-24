export const dynamic = "force-dynamic";
import { Archive, Copy, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

const tabs = ["Overview", "Instructions", "Tools", "Test", "Executions", "Versions", "Settings"];

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const data = await getWorkspaceOverview();
  const agent = data.agents.find((item) => item.id === agentId) ?? data.agents[0];
  return <PageFrame title={agent.name} description="Agent detail workspace with activation controls, tool permissions, mock test traces, versions, and execution history." actions={<><Button><Play className="size-4" />Activate</Button><Button variant="outline"><Pause className="size-4" />Pause</Button><Button variant="outline"><Copy className="size-4" />Duplicate</Button><Button variant="outline"><Archive className="size-4" />Archive</Button></>}>
    <div className="flex flex-wrap gap-2">{tabs.map((tab) => <span key={tab} className="rounded-md border bg-card px-3 py-1.5 text-sm">{tab}</span>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Overview</CardTitle><StatusBadge status={agent.status} /></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Provider</div>{agent.modelProvider}</div><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Model</div>{agent.modelName}</div><div className="rounded-md border p-3"><div className="text-xs text-muted-foreground">Success</div>{Math.round(agent.successRate * 100)}%</div></div><div><div className="mb-2 text-sm font-medium">Allowed tools</div><div className="flex flex-wrap gap-2">{agent.tools.map((tool) => <span key={tool} className="rounded bg-muted px-2 py-1 text-xs">{tool}</span>)}</div></div><pre className="overflow-auto rounded-md bg-muted p-3 text-xs"><code>{JSON.stringify({ approvalPolicy: "write_actions", maxSteps: 6, timeoutSeconds: 60, structuredOutput: true }, null, 2)}</code></pre></CardContent></Card><Card><CardHeader><CardTitle>Versions and test</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><Button variant="outline" className="w-full"><RotateCcw className="size-4" />Create new version</Button><div className="rounded-md border p-3">v1 Active configuration snapshot</div><div className="rounded-md border p-3">Mock test result: deterministic structured output, tool validation enabled.</div></CardContent></Card></div>
  </PageFrame>;
}