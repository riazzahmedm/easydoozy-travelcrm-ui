"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/lib/auth";

export function Topbar({ user }: { user: AuthUser }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium">
            {user.email ?? user.userId}
          </div>
          <div className="text-xs text-muted-foreground">
            {user.role.replace("_", " ")}
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
