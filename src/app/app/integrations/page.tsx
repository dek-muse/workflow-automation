import { Plug, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";

const groups = [
  { category: "Communication", items: [["Gmail", "Read and draft email with approval before send", "OAuth client", "Coming soon"], ["Slack", "Create channel notifications and approvals", "Bot token", "Coming soon"], ["Telegram", "Send operational notifications", "Bot token", "Coming soon"], ["WhatsApp Business", "Customer message workflows", "Business API", "Coming soon"]] },
  { category: "Social", items: [["Instagram", "Draft and schedule content placeholders", "OAuth app", "Coming soon"], ["Facebook", "Approval-gated social drafts", "OAuth app", "Coming soon"], ["TikTok", "Campaign content workflow", "OAuth app", "Coming soon"], ["LinkedIn", "B2B post drafts and tasks", "OAuth app", "Coming soon"]] },
  { category: "Productivity", items: [["Google Calendar", "Schedule follow-up meetings", "OAuth client", "Coming soon"], ["Webhook", "Receive signed events locally", "Signing secret", "Development-ready"], ["Generic REST API", "Approval-gated outbound HTTP", "Endpoint credentials", "Development-ready"]] },
] as const;

export default function Page() {
  return <PageFrame title="Integrations Catalog" description="Connect external systems through explicit, approval-aware integration boundaries. Real integrations stay disabled until credentials are configured." actions={<Button variant="outline"><ShieldCheck className="size-4" />Mock mode enabled</Button>}>
    <div className="space-y-5">{groups.map((group) => <section key={group.category}><h2 className="mb-3 text-sm font-semibold">{group.category}</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{group.items.map(([name, description, credentials, status]) => <Card key={name}><CardHeader><div className="flex items-start justify-between gap-3"><CardTitle className="flex items-center gap-2"><Plug className="size-4 text-primary" />{name}</CardTitle><StatusBadge status={status === "Development-ready" ? "PAUSED" : "DISCONNECTED"} /></div></CardHeader><CardContent className="space-y-3 text-sm"><p className="text-muted-foreground">{description}</p><div className="rounded-md bg-muted p-2 text-xs">Required credentials: {credentials}</div><div className="flex gap-2"><Button size="sm" variant="outline">Configure</Button><Button size="sm" variant="outline">Test</Button></div><p className="text-xs text-muted-foreground">{status}. No real-world action is faked without credentials.</p></CardContent></Card>)}</div></section>)}</div>
  </PageFrame>;
}