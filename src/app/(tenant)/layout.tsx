import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-auth";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "TENANT_ADMIN" && user.role !== "AGENT") {
    redirect("/login");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
