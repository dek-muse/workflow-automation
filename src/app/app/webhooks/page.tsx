import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/page-frame";

export default function Page() {
  return <PageFrame title="Webhooks" description="Generic local webhook integration foundation with signature verification boundaries and event replay planned." actions={<Button><KeyRound className="size-4" />Create endpoint</Button>}>
    <Card><CardHeader><CardTitle>Local webhook endpoint</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="rounded-md border p-3">URL path: /api/webhooks/:endpoint</div><div className="rounded-md border p-3">Security: secret hash and signature verification foundation</div><div className="rounded-md border p-3">Capabilities: trigger workflows, store events, prevent duplicate processing</div></CardContent></Card>
  </PageFrame>;
}