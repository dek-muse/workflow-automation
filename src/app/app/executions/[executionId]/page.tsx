export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Braces, Clock, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getExecutionDetail } from "@/server/services/demo-workspace.service";

export default async function Page({ params }: { params: Promise<{ executionId: string }> }) {
  const { executionId } = await params;
  const execution = await getExecutionDetail(executionId);
  if (!execution && !executionId.startsWith("seed-")) notFound();
  return <PageFrame title="Execution trace" description="Step-by-step execution context, AI metadata, tool calls, approvals, retry state, and audit-ready payloads." actions={<><Button variant="outline"><RotateCcw className="size-4" />Retry</Button><Button variant="outline"><XCircle className="size-4" />Cancel</Button></>}>
    {execution ? <>
      <Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle>{execution.workflow.name}</CardTitle><StatusBadge status={execution.status} /></div></CardHeader><CardContent className="grid gap-3 text-sm md:grid-cols-4"><div><div className="text-muted-foreground">Started</div>{execution.startedAt?.toLocaleString() ?? "Not started"}</div><div><div className="text-muted-foreground">Completed</div>{execution.completedAt?.toLocaleString() ?? "Open"}</div><div><div className="text-muted-foreground">AI requests</div>{execution.aiRequests.length}</div><div><div className="text-muted-foreground">Approvals</div>{execution.approvals.length}</div></CardContent></Card>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="size-4 text-primary" />Timeline</CardTitle></CardHeader><CardContent className="space-y-3">{execution.steps.map((step, index) => <div key={step.id} className="grid grid-cols-[32px_1fr] gap-3"><div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs">{index + 1}</div><div className="rounded-md border p-3"><div className="flex items-center justify-between gap-2"><div className="font-medium">{step.nodeKey}</div><StatusBadge status={step.status} /></div><div className="mt-1 text-xs text-muted-foreground">{step.nodeType} · attempt {step.attempt}</div></div></div>)}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Braces className="size-4 text-primary" />Payload preview</CardTitle></CardHeader><CardContent><pre className="max-h-[520px] overflow-auto rounded-md bg-muted p-3 text-xs"><code>{JSON.stringify({ input: execution.input, output: execution.output, aiRequests: execution.aiRequests.map((item) => ({ provider: item.provider, model: item.model, tokens: item.inputTokens + item.outputTokens })) }, null, 2)}</code></pre></CardContent></Card></div>
    </> : <EmptyState title="Seed execution preview" description="This fallback execution exists in demo mode. Run the New Lead Assistant with a seeded database to persist and inspect a full trace." />}
  </PageFrame>;
}