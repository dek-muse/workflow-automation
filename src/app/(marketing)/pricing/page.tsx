import { PageFrame } from "@/components/page-frame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const plans = ["Free", "Starter", "Business", "Agency"];
export default function PricingPage() { return <main className="p-8"><PageFrame title="Pricing" description="Billing-ready plan architecture without fake payment processing."><div className="grid gap-4 md:grid-cols-4">{plans.map((plan) => <Card key={plan}><CardHeader><CardTitle>{plan}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Usage limits, workspace seats, active workflows, and AI request quotas are modeled in the database.</p></CardContent></Card>)}</div></PageFrame></main>; }
