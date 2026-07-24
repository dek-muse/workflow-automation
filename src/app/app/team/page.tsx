export const dynamic = "force-dynamic";

import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, PageFrame } from "@/components/page-frame";

const roles = ["Owner", "Admin", "Automation Manager", "Approver", "Operator", "Analyst", "Viewer"];
const members = [{ name: "Demo Owner", email: "demo@flowpilot.local", role: "Owner" }, { name: "Asha Patel", email: "asha@example.com", role: "Approver" }, { name: "Noah Kim", email: "noah@example.com", role: "Operator" }];

export default function Page() {
  return <PageFrame title="Team" description="Manage workspace members, invitations, and role-based access boundaries." actions={<Button><UserPlus className="size-4" />Invite teammate</Button>}>
    <div className="grid gap-3 md:grid-cols-3"><Metric label="Members" value={String(members.length)} detail="Seeded/demo team" /><Metric label="Roles" value={String(roles.length)} detail="RBAC levels supported" /><Metric label="Pending invites" value="0" detail="Invitation scaffold ready" /></div>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="size-4 text-primary" />Workspace members</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Permissions</th></tr></thead><tbody>{members.map((member) => <tr key={member.email} className="border-t"><td className="py-3 font-medium">{member.name}</td><td>{member.email}</td><td>{member.role}</td><td className="text-muted-foreground">Server-side RBAC enforced</td></tr>)}</tbody></table></CardContent></Card>
  </PageFrame>;
}