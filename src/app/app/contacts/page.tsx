export const dynamic = "force-dynamic";
import { Filter, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metric, PageFrame } from "@/components/page-frame";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWorkspaceOverview } from "@/server/services/demo-workspace.service";

export default async function Page() {
  const data = await getWorkspaceOverview();
  return <PageFrame title="Contacts" description="Lightweight CRM records created by people, agents, and workflow tools with workspace isolation." actions={<><Button variant="outline"><Search className="size-4" />Search</Button><Button><Plus className="size-4" />Create contact</Button></>}>
    <div className="grid gap-3 md:grid-cols-4"><Metric label="Contacts" value={String(data.contacts.length)} detail="Visible in this workspace" /><Metric label="Qualified" value={String(data.contacts.filter((contact) => contact.status === "QUALIFIED").length)} detail="Ready for follow-up" /><Metric label="Tasks linked" value={String(data.tasks.filter((task) => task.contactName).length)} detail="Contact-related tasks" /><Metric label="Processed" value={String(data.metrics.contactsProcessed)} detail="Analytics source" /></div>
    <Card><CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="flex items-center gap-2"><Users className="size-4 text-primary" />CRM contacts</CardTitle><div className="flex gap-2"><Input placeholder="Search name, email, company" className="md:w-80" /><Button variant="outline"><Filter className="size-4" />Filters</Button></div></div></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Name</th><th>Email</th><th>Company</th><th>Status</th><th>Tags</th><th>Updated</th></tr></thead><tbody>{data.contacts.map((contact) => <tr key={contact.id} className="border-t"><td className="py-3 font-medium">{contact.firstName} {contact.lastName}</td><td>{contact.email}</td><td>{contact.company ?? "-"}</td><td><StatusBadge status={contact.status} /></td><td><div className="flex flex-wrap gap-1">{contact.tags.map((tag) => <span key={tag} className="rounded bg-muted px-2 py-1 text-xs">{tag}</span>)}</div></td><td className="text-muted-foreground">{contact.updatedAt.toLocaleDateString()}</td></tr>)}</tbody></table></CardContent></Card>
  </PageFrame>;
}