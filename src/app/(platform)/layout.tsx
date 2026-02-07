import { ProtectedLayout } from "@/components/layout/protected-layout";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["SUPER_ADMIN"]}>
      {children}
    </ProtectedLayout>
  );
}
