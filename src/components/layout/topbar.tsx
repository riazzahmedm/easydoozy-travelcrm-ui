"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";

export function Topbar() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div />

      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div className="font-medium">{user.email}</div>
          <div className="text-xs text-muted-foreground">
            {user.role}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
