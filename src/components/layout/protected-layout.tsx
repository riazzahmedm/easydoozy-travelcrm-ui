"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  allowedRoles?: Array<"SUPER_ADMIN" | "TENANT_ADMIN" | "AGENT">;
}

export function ProtectedLayout({
  children,
  allowedRoles,
}: Props) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

   if (!user) {
      router.replace("/login");
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/login");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
