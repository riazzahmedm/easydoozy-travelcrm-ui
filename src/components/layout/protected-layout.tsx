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
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }

    if (
      user &&
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace("/login");
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
