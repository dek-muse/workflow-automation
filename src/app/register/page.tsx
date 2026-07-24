import Link from "next/link";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ArrowRight, CheckCircle2, KeyRound, LogIn, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  workspaceName: z.string().min(2),
});

async function register(formData: FormData) {
  "use server";
  const input = registerSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    workspaceName: formData.get("workspaceName"),
  });
  const slugBase = input.workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workspace";
  const [{ prisma }, { signIn }] = await Promise.all([import("@/server/database/client"), import("@/server/auth/auth")]);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
  const workspace = await prisma.workspace.create({ data: { name: input.workspaceName, slug: `${slugBase}-${user.id.slice(-6)}` } });
  await prisma.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role: "OWNER" } });
  await prisma.subscription.create({ data: { workspaceId: workspace.id, plan: "FREE", status: "active" } });
  await signIn("credentials", { email: input.email, password: input.password, redirectTo: "/onboarding" });
  redirect("/onboarding");
}

const highlights = [
  "Mock AI provider works locally without paid keys",
  "Workspace, RBAC, workflows, approvals, and audit logs included",
  "Start with the New Lead Assistant demo automation",
];

export default function RegisterPage() {
  return <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
      <section className="hidden lg:block">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><KeyRound className="size-4" /></span>
          FlowPilot AI
        </Link>
        <div className="mt-12 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> Business automation workspace
          </div>
          <h1 className="text-4xl font-semibold tracking-normal">Create your automation control center.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Set up a workspace, invite your team, and run AI-assisted workflows with approvals, traces, CRM tasks, and analytics from day one.</p>
          <div className="mt-8 grid gap-3">
            {highlights.map((item) => <div key={item} className="flex items-start gap-3 rounded-lg border bg-card p-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>)}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold"><KeyRound className="size-5 text-primary" />FlowPilot AI</Link>
          <Button asChild variant="outline" size="sm"><Link href="/login"><LogIn className="size-4" />Log in</Link></Button>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-soft md:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal">Create account</h2>
              <p className="mt-1 text-sm text-muted-foreground">Create your owner account and first workspace.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/login"><LogIn className="size-4" />Log in</Link>
            </Button>
          </div>

          <form action={register} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Name<Input name="name" required autoComplete="name" placeholder="Your name" className="mt-1" /></label>
              <label className="text-sm font-medium">Workspace<Input name="workspaceName" required placeholder="Acme Operations" className="mt-1" /></label>
            </div>
            <label className="block text-sm font-medium">Email<Input name="email" required type="email" autoComplete="email" placeholder="you@example.com" className="mt-1" /></label>
            <label className="block text-sm font-medium">Password<Input name="password" required type="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" className="mt-1" /></label>

            <div className="rounded-lg border bg-background p-3 text-xs leading-5 text-muted-foreground">
              <div className="mb-1 flex items-center gap-2 font-medium text-foreground"><ShieldCheck className="size-4 text-primary" />Secure by default</div>
              Passwords are hashed, sessions are JWT-backed, and workspace access is protected server-side.
            </div>

            <Button className="w-full" type="submit">Create workspace <ArrowRight className="size-4" /></Button>
          </form>

          <div className="mt-5 flex flex-col gap-2 border-t pt-4 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-center">
            <span>Already have an account?</span>
            <Link href="/login" className="inline-flex items-center justify-center gap-1 font-medium text-primary hover:underline">Log in instead <ArrowRight className="size-3" /></Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-3"><Workflow className="mb-2 size-4 text-primary" />Workflow builder ready</div>
          <div className="rounded-lg border bg-card p-3"><ShieldCheck className="mb-2 size-4 text-primary" />Approval-safe actions</div>
          <div className="rounded-lg border bg-card p-3"><KeyRound className="mb-2 size-4 text-primary" />Tenant isolation</div>
        </div>
      </section>
    </div>
  </main>;
}