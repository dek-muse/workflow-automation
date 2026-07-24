import { Plus, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageFrame } from "@/components/page-frame";

const templates = ["New lead assistant", "Weekly business report", "Customer support triage", "Social content approval", "Overdue task reminder"];

export default function Page() {
  return <PageFrame title="New workflow" description="Choose a template or build an ordered automation with validation-ready trigger, action, branch, delay, and approval nodes." actions={<Button><Workflow className="size-4" />Save draft</Button>}>
    <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
      <Card><CardHeader><CardTitle>Templates</CardTitle></CardHeader><CardContent className="space-y-2">{templates.map((template) => <button key={template} className="w-full rounded-md border p-3 text-left text-sm hover:bg-muted"><div className="font-medium">{template}</div><div className="text-xs text-muted-foreground">Creates valid workflow records when implemented through the template action.</div></button>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Workflow setup</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-2"><Input placeholder="Workflow name" /><Input placeholder="Trigger type: manual, schedule, webhook" /></div><div className="grid gap-3 md:grid-cols-[220px_1fr_280px]"><div className="rounded-md border p-3 text-sm">Palette<br />Trigger<br />AI Agent<br />Condition<br />Approval<br />Task<br />Notification</div><div className="rounded-md border p-3 text-sm">Ordered steps<br />1. Trigger<br />2. AI agent<br />3. Create task<br />4. Notify team<br /><Button className="mt-3" variant="outline" size="sm"><Plus className="size-4" />Add step</Button></div><div className="rounded-md border p-3 text-sm">Selected configuration<br />Required fields<br />Retry rules<br />Failure behavior</div></div></CardContent></Card>
    </div>
  </PageFrame>;
}