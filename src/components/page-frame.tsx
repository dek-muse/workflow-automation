import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageFrame({ title, description, actions, children }: { title: string; description: string; actions?: React.ReactNode; children?: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-balance text-2xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
    {children}
  </div>;
}

export function Metric({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: "default" | "good" | "warn" | "bad" }) {
  return <Card className={cn("overflow-hidden", tone === "good" && "border-emerald-200 dark:border-emerald-900", tone === "warn" && "border-amber-200 dark:border-amber-900", tone === "bad" && "border-red-200 dark:border-red-900")}>
    <CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</CardTitle></CardHeader>
    <CardContent className="p-4 pt-0"><div className="text-2xl font-semibold tabular-nums">{value}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></CardContent>
  </Card>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed bg-card p-6 text-center">
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
    {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
  </div>;
}

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-3 flex items-center justify-between gap-3">
    <div><h2 className="text-sm font-semibold">{title}</h2>{description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}</div>
    {action}
  </div>;
}