import { ProtectedLayout } from "@/components/layout/protected-layout";
import { AppShell } from "@/components/layout/app-shell";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["SUPER_ADMIN"]}>
      <AppShell>{children}</AppShell>
    </ProtectedLayout>
  );
}
