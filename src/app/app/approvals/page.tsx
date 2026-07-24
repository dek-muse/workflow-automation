export const dynamic = "force-dynamic";

import { AlertTriangle, CheckCircle2, MessageSquareText, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";
import { decideApproval } from "./actions";

export default async function Page() {
  const data = await getWorkspaceOverview();
  const statuses = ["PENDING", "APPROVED", "REJECTED", "EXPIRED"];
  return <PageFrame title="Approval Center" description="Review sensitive workflow and agent actions with risk context before they continue." actions={<Button variant="outline"><MessageSquareText className="size-4" />Reviewer notes</Button>}>
    <div className="grid gap-3 md:grid-cols-4">{statuses.map((status) => <Metric key={status} label={status.toLowerCase()} value={String(data.approvals.filter((approval) => approval.status === status).length)} detail="Approval requests" />)}</div>
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="size-4 text-amber-600" />Requests</CardTitle></CardHeader><CardContent className="space-y-3">{data.approvals.length ? data.approvals.map((approval) => <div key={approval.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><div className="font-semibold">{approval.requestedAction}</div><div className="mt-1 text-sm text-muted-foreground">{approval.workflowName ?? "Agent action"} · requested {approval.createdAt.toLocaleString()}</div></div><StatusBadge status={approval.status} /></div><p className="mt-3 text-sm leading-6">{approval.humanSummary}</p><form action={decideApproval} className="mt-3 flex flex-wrap items-center gap-2"><input type="hidden" name="approvalId" value={approval.id} /><input name="reviewerNotes" className="h-8 rounded-md border bg-background px-2 text-sm" placeholder="Reviewer notes" /><span className="rounded bg-muted px-2 py-1 text-xs">Risk: {approval.riskLevel}</span><Button size="sm" name="decision" value="APPROVED" disabled={approval.status !== "PENDING"}><CheckCircle2 className="size-4" />Approve</Button><Button size="sm" variant="outline" name="decision" value="REJECTED" disabled={approval.status !== "PENDING"}><XCircle className="size-4" />Reject</Button></form></div>) : <EmptyState title="No approval requests" description="Approval nodes and destructive tools will pause here with input payloads, affected data, and reviewer controls." />}</CardContent></Card><Card><CardHeader><CardTitle>Lifecycle controls</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="rounded-md border p-3">Server-side permission validation gates decisions.</div><div className="rounded-md border p-3">Duplicate decisions are blocked by approval status.</div><div className="rounded-md border p-3">Approved workflows move out of waiting state and write audit logs.</div><div className="rounded-md border p-3">Sensitive payload fields are redacted before audit display.</div></CardContent></Card></div>
  </PageFrame>;
}