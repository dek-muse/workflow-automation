export const dynamic = "force-dynamic";

import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, Metric, PageFrame } from "@/components/page-frame";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  const items = data.activity.map((item) => ({ id: item.id, title: item.action, body: item.details, read: false, createdAt: item.createdAt }));
  return <PageFrame title="Notifications" description="In-app notification center for approvals, workflow outcomes, integration issues, usage warnings, and team events." actions={<Button variant="outline"><CheckCheck className="size-4" />Mark all read</Button>}>
    <div className="grid gap-3 md:grid-cols-3"><Metric label="Unread" value={String(items.filter((item) => !item.read).length)} detail="Needs attention" /><Metric label="Workflow events" value={String(items.length)} detail="Recent activity notifications" /><Metric label="Channels" value="4" detail="Email, Slack, Telegram, push ready" /></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-4 text-primary" />Notification stream</CardTitle></CardHeader><CardContent className="space-y-2">{items.length ? items.map((item) => <div key={item.id} className="rounded-md border p-3 text-sm"><div className="font-medium">{item.title}</div><div className="mt-1 text-muted-foreground">{item.body}</div><div className="mt-2 text-xs text-muted-foreground">{item.createdAt.toLocaleString()}</div></div>) : <EmptyState title="No notifications yet" description="Workflow completions, failures, approvals, usage warnings, and integration disconnects will appear here." />}</CardContent></Card>
  </PageFrame>;
}