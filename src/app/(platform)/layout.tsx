import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server-auth";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
