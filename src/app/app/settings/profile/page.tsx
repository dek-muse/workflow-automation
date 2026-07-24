import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageFrame } from "@/components/page-frame";

export default function Page() {
  return <PageFrame title="Profile Settings" description="User profile settings scaffolded for the authenticated account." actions={<Button>Save profile</Button>}>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="size-4 text-primary" />Profile</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">Name<Input className="mt-1" defaultValue="Demo Owner" /></label><label className="text-sm font-medium">Email<Input className="mt-1" defaultValue="demo@flowpilot.local" readOnly /></label><div className="rounded-md border p-3 text-sm text-muted-foreground md:col-span-2">Email verification and forgot-password foundations are represented in auth schema and can be connected to an email provider.</div></CardContent></Card>
  </PageFrame>;
}