import { ProtectedLayout } from "@/components/layout/protected-layout";
import { AppShell } from "@/components/layout/app-shell";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["TENANT_ADMIN", "AGENT"]}>
      <AppShell>{children}</AppShell>
    </ProtectedLayout>
  );
}
