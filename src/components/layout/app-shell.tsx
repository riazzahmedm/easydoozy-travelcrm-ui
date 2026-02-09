import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AuthUser } from "@/lib/auth";

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 bg-muted">
          {children}
        </main>
      </div>
    </div>
  );
}
