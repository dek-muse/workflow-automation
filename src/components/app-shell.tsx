"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, Bell, Bot, Boxes, CheckCircle2, ChevronLeft, ChevronRight, CircleDollarSign, Gauge, Home, KeyRound, Menu, Moon, Plug, Search, Settings, ShieldCheck, Users, WalletCards, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const groups = [
  { label: "Overview", items: [["Dashboard", "/app/dashboard", Home], ["Activity", "/app/activity", Activity]] },
  { label: "Build", items: [["AI Agents", "/app/agents", Bot], ["Workflows", "/app/workflows", Workflow], ["Executions", "/app/executions", Boxes], ["Approvals", "/app/approvals", CheckCircle2]] },
  { label: "Business", items: [["Contacts", "/app/contacts", Users], ["Tasks", "/app/tasks", Gauge], ["Analytics", "/app/analytics", Zap]] },
  { label: "Connections", items: [["Integrations", "/app/integrations", Plug], ["Webhooks", "/app/webhooks", KeyRound]] },
  { label: "Administration", items: [["Team", "/app/team", Users], ["Audit Logs", "/app/audit-logs", ShieldCheck], ["Settings", "/app/settings", Settings], ["Billing", "/app/settings/billing", WalletCards]] },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { localStorage.setItem("flowpilot-sidebar", collapsed ? "collapsed" : "expanded"); }, [collapsed]);

  const crumbs = pathname.split("/").filter(Boolean).slice(1).map((part) => part.replaceAll("-", " "));
  const sidebar = <aside className={cn("flex h-full flex-col border-r bg-card transition-all", collapsed ? "w-[76px]" : "w-[268px]")}> 
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <Link href="/app/dashboard" className="flex min-w-0 items-center gap-2 font-semibold"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><KeyRound className="size-4" /></span>{collapsed ? null : <span>FlowPilot AI</span>}</Link>
      <button aria-label="Toggle sidebar" className="ml-auto hidden rounded-md p-1.5 hover:bg-muted lg:block" onClick={() => setCollapsed((value) => !value)}>{collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}</button>
    </div>
    <div className="p-3">
      <div className="rounded-lg border bg-background p-3">
        <div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded bg-muted text-xs font-semibold">AO</span>{collapsed ? null : <div className="min-w-0"><div className="truncate text-sm font-medium">Acme Operations</div><div className="text-xs text-muted-foreground">Business plan</div></div>}</div>
        {collapsed ? null : <><div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-1.5 w-2/3 rounded-full bg-primary" /></div><div className="mt-2 text-xs text-muted-foreground">67% monthly automation usage</div></>}
      </div>
    </div>
    <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
      {groups.map((group) => <div key={group.label} className="mt-3 first:mt-0">
        {collapsed ? null : <div className="px-2 pb-1 text-[11px] font-medium uppercase text-muted-foreground">{group.label}</div>}
        <div className="space-y-1">{group.items.map(([label, href, Icon]) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} title={label} onClick={() => setMobileOpen(false)} className={cn("flex h-9 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-muted", active ? "bg-muted text-foreground" : "text-muted-foreground", collapsed && "justify-center")}><Icon className="size-4 shrink-0" />{collapsed ? null : <span className="truncate">{label}</span>}</Link>;
        })}</div>
      </div>)}
    </nav>
  </aside>;

  return <div className="min-h-screen bg-background">
    <div className="lg:hidden flex h-14 items-center justify-between border-b bg-card px-3"><Button variant="ghost" size="sm" onClick={() => setMobileOpen(true)}><Menu className="size-4" /></Button><Link href="/app/dashboard" className="font-semibold">FlowPilot AI</Link><Bell className="size-4 text-muted-foreground" /></div>
    {mobileOpen ? <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}><div className="h-full w-[280px]" onClick={(event) => event.stopPropagation()}>{sidebar}</div></div> : null}
    <div className={cn("grid min-h-screen", collapsed ? "lg:grid-cols-[76px_1fr]" : "lg:grid-cols-[268px_1fr]")}> 
      <div className="hidden lg:block">{sidebar}</div>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 hidden h-14 items-center gap-3 border-b bg-background/95 px-5 backdrop-blur lg:flex">
          <button className="flex min-w-[260px] items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground"><Search className="size-4" />Search automations, contacts, tasks</button>
          <div className="ml-auto flex items-center gap-2"><Button variant="ghost" size="sm"><Bell className="size-4" /></Button><ThemeButton /><Button variant="outline" size="sm"><CircleDollarSign className="size-4" />Usage</Button><div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">DO</div></div>
        </header>
        <main className="min-w-0 p-4 md:p-6">
          <div className="mb-4 hidden text-xs capitalize text-muted-foreground lg:block">{crumbs.length ? crumbs.join(" / ") : "dashboard"}</div>
          {children}
        </main>
      </div>
    </div>
  </div>;
}

function ThemeButton() {
  return <Button variant="ghost" size="sm" onClick={() => { document.documentElement.classList.toggle("dark"); }} aria-label="Toggle theme"><Moon className="size-4" /></Button>;
}