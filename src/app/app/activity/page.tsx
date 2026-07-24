export const dynamic = "force-dynamic";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Activity" description="A concise stream of meaningful workspace events from audit logs and automation activity.">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="size-4 text-primary" />Workspace timeline</CardTitle></CardHeader><CardContent className="space-y-3">{data.activity.map((item) => <div key={item.id} className="grid gap-3 border-l-2 border-primary pl-4 text-sm md:grid-cols-[1fr_auto]"><div><div className="font-medium">{item.action}</div><div className="text-muted-foreground">{item.details}</div></div><div className="flex items-center gap-2"><StatusBadge status={item.result} /><span className="text-xs text-muted-foreground">{item.createdAt.toLocaleString()}</span></div></div>)}</CardContent></Card>
  </PageFrame>;
}