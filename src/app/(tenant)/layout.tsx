import { ProtectedLayout } from "@/components/layout/protected-layout";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout
      allowedRoles={["TENANT_ADMIN", "AGENT"]}
    >
      {children}
    </ProtectedLayout>
  );
}
