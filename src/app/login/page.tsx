import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function login(formData: FormData) {
  "use server";
  try {
    const { signIn } = await import("@/server/auth/auth");
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/app/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=credentials");
    throw error;
  }
}

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const hasCredentialsError = params?.error === "credentials";

  return <main className="grid min-h-screen place-items-center p-6">
    <form action={login} className="w-full max-w-sm space-y-3 rounded-lg border bg-card p-5 shadow-soft">
      <div><h1 className="text-xl font-semibold">Sign in</h1><p className="mt-1 text-sm text-muted-foreground">Access your FlowPilot workspace.</p></div>
      {hasCredentialsError ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">Sign in failed. Check the email/password and make sure the database is running and seeded.</p> : null}
      <label className="block text-sm font-medium">Email<Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-1" /></label>
      <label className="block text-sm font-medium">Password<Input name="password" type="password" autoComplete="current-password" required placeholder="Password" className="mt-1" /></label>
      <Button className="w-full" type="submit">Continue</Button>
      <p className="text-xs text-muted-foreground">Local demo: demo@flowpilot.local / FlowPilotDemo123!</p>
    </form>
  </main>;
}