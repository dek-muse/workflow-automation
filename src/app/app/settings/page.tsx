import Link from "next/link";
import { CreditCard, LockKeyhole, Settings, User, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";

const settings = [["Profile", "/app/settings/profile", User, "Name, avatar, and account preferences"], ["Workspace", "/app/settings/workspace", Workflow, "Workspace identity, timezone, language, and limits"], ["Security", "/app/settings/security", LockKeyhole, "Sessions, password policy, API keys, and audit controls"], ["Billing", "/app/settings/billing", CreditCard, "Plan, usage, and billing-provider readiness"]] as const;

export default function Page() {
  return <PageFrame title="Settings" description="Centralized account, workspace, security, and billing-ready configuration.">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{settings.map(([label, href, Icon, description]) => <Link key={href} href={href}><Card className="h-full hover:bg-muted"><CardHeader><CardTitle className="flex items-center gap-2"><Icon className="size-4 text-primary" />{label}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{description}</p></CardContent></Card></Link>)}</div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="size-4 text-primary" />Configuration boundaries</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm md:grid-cols-3"><div className="rounded-md border p-3">Workspace-scoped changes require membership checks.</div><div className="rounded-md border p-3">Secrets stay server-only through environment validation.</div><div className="rounded-md border p-3">Billing remains provider-ready, not fake payment processing.</div></CardContent></Card>
  </PageFrame>;
}