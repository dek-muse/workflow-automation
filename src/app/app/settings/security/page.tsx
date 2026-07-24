import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";

export default function Page() {
  return <PageFrame title="Security Settings" description="Security controls for sessions, API keys, webhooks, credentials, and audit policy." actions={<Button variant="outline"><KeyRound className="size-4" />Create API key</Button>}>
    <div className="grid gap-3 lg:grid-cols-3"><Card><CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="size-4 text-primary" />Sessions</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Database-backed NextAuth sessions, secure cookies, and safe credential errors.</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="size-4 text-primary" />API keys</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Schema supports hashed API keys with prefixes, revocation, expiry, and last-used tracking.</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Audit</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Sensitive values are redacted before display and security failures are audit-log ready.</CardContent></Card></div>
  </PageFrame>;
}