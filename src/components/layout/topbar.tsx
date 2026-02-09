"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/lib/auth";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Topbar({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsConfirmOpen(false);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-20 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 md:flex">
          {user.email ? user.email[0]?.toUpperCase() : "U"}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {user.email}
          </div>
          <div className="text-xs text-muted-foreground">
            {user.role.replace("_", " ")}
          </div>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>
              Are you sure you want to end your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Spinner size={14} className="text-white" />
                  Signing out
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
