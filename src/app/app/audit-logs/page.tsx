export const dynamic = "force-dynamic";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Audit Logs" description="Security-relevant workspace actions with redacted payload previews and filter-ready structure.">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Audit events</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Action</th><th>Entity</th><th>Result</th><th>Time</th><th>Details</th></tr></thead><tbody>{data.activity.map((item) => <tr key={item.id} className="border-t"><td className="py-3 font-medium">{item.action}</td><td>{item.entityType}</td><td><StatusBadge status={item.result} /></td><td className="text-muted-foreground">{item.createdAt.toLocaleString()}</td><td className="text-muted-foreground">Sensitive fields redacted</td></tr>)}</tbody></table></CardContent></Card>
  </PageFrame>;
}