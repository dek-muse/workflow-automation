import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
const signals = [
  { Icon: Workflow, label: "Lead workflow running" },
  { Icon: Bot, label: "Agent drafted next action" },
  { Icon: ShieldCheck, label: "Approval required before external send" }
];
export default function HomePage() { return <main className="min-h-screen"><section className="grid min-h-[88vh] content-center gap-8 px-6 py-12 md:px-12 lg:grid-cols-[1fr_460px]"><div className="max-w-3xl"><div className="text-sm font-medium text-primary">FlowPilot AI</div><h1 className="mt-4 text-5xl font-semibold tracking-normal">AI operations automation for growing businesses</h1><p className="mt-5 max-w-2xl text-lg text-muted-foreground">Connect tools, coordinate agents, run approval-safe workflows, and measure the operational time your team wins back.</p><div className="mt-7 flex gap-3"><Button asChild><Link href="/register">Start local demo <ArrowRight className="size-4" /></Link></Button><Button variant="outline" asChild><Link href="/features">Explore features</Link></Button></div></div><div className="rounded-lg border bg-card p-4 shadow-soft"><div className="grid gap-3">{signals.map(({ Icon, label }) => <div key={label} className="flex items-center gap-3 rounded-md border p-3"><Icon className="size-5 text-primary" /><span className="text-sm font-medium">{label}</span></div>)}</div></div></section></main>; }
