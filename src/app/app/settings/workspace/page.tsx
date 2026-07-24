import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageFrame } from "@/components/page-frame";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Workspace Settings" description="Tenant profile, localization, and usage-limit settings." actions={<Button>Save workspace</Button>}>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Workflow className="size-4 text-primary" />Workspace</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">Name<Input className="mt-1" defaultValue={data.workspace.name} /></label><label className="text-sm font-medium">Slug<Input className="mt-1" defaultValue={data.workspace.slug} /></label><label className="text-sm font-medium">Timezone<Input className="mt-1" defaultValue={data.workspace.timezone} /></label><label className="text-sm font-medium">Default language<Input className="mt-1" defaultValue="en" /></label></CardContent></Card>
  </PageFrame>;
}