import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { auth } from "@/server/auth/auth";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <AppShell>{children}</AppShell>;
}