export const dynamic = "force-dynamic";
import Link from "next/link";
import { Bot, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="AI Agent Studio" description="Design, govern, test, and version workspace-scoped AI agents. Local environments use the deterministic mock provider until real credentials are configured." actions={<><Button variant="outline"><Search className="size-4" />Search</Button><Button asChild><Link href="/app/agents/new"><Plus className="size-4" />Create agent</Link></Button></>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Agents" value={String(data.agents.length)} detail="Configured in this workspace" /><Metric label="Active" value={String(data.agents.filter((agent) => agent.status === "ACTIVE").length)} detail="Available to workflows" /><Metric label="Mock provider" value={String(data.agents.filter((agent) => agent.modelProvider === "mock").length)} detail="Works without paid keys" /><Metric label="Avg success" value={`${Math.round((data.agents.reduce((sum, agent) => sum + agent.successRate, 0) / Math.max(1, data.agents.length)) * 100)}%`} detail="From recent executions" /></div>
    <Card><CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="flex items-center gap-2"><Bot className="size-4 text-primary" />Agents</CardTitle><div className="flex gap-2"><Input placeholder="Search agents" className="md:w-72" /><Button variant="outline"><Filter className="size-4" />Status</Button><Button variant="outline"><SlidersHorizontal className="size-4" />Sort</Button></div></div></CardHeader><CardContent><div className="grid gap-3 lg:grid-cols-2">{data.agents.map((agent) => <Link href={`/app/agents/${agent.id}`} key={agent.id} className="rounded-lg border p-4 hover:bg-muted"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{agent.name}</div><div className="mt-1 text-sm text-muted-foreground">{agent.modelProvider}/{agent.modelName} · {agent.tools.length} approved tools</div></div><StatusBadge status={agent.status} /></div><div className="mt-3 flex flex-wrap gap-2">{agent.tools.slice(0, 4).map((tool) => <span key={tool} className="rounded bg-muted px-2 py-1 text-xs">{tool}</span>)}</div><div className="mt-3 text-xs text-muted-foreground">Success rate {Math.round(agent.successRate * 100)}% · Last execution {agent.lastExecution ? agent.lastExecution.toLocaleString() : "None yet"}</div></Link>)}</div></CardContent></Card>
  </PageFrame>;
}