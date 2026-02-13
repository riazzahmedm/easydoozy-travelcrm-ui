"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/lib/navigation";
import clsx from "clsx";
import { AuthUser } from "@/lib/auth";
import {
  Building2,
  CreditCard,
  Layers,
  LayoutDashboard,
  MapPin,
  Package,
  Tags,
  UserRound,
} from "lucide-react";

export function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const items = NAVIGATION[user.role];
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    "/plans": Layers,
    "/tenants": Building2,
    "/subscriptions": CreditCard,
    "/tenant-dashboard": LayoutDashboard,
    "/platform-dashboard": LayoutDashboard,
    "/agents": UserRound,
    "/destinations": MapPin,
    "/packages": Package,
    "/subscription": CreditCard,
    "/tags": Tags
  };

  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      <div className="h-20 px-6 flex items-center border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold">
            TC
          </div>
          <div>
            <div className="text-base font-semibold leading-none">
              Travel CRM
            </div>
            <div className="text-xs text-muted-foreground">
              {user.role.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="px-3 pb-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition",
              pathname.startsWith(item.href)
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className="flex items-center gap-2">
              {(() => {
                const Icon = icons[item.href];
                return Icon ? (
                  <Icon
                    className={clsx(
                      "h-4 w-4",
                      pathname.startsWith(item.href)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />
                ) : null;
              })()}
              {item.label}
            </span>
            <span
              className={clsx(
                "h-2 w-2 rounded-full transition",
                pathname.startsWith(item.href)
                  ? "bg-white"
                  : "bg-slate-200 group-hover:bg-slate-300"
              )}
            />
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t text-xs text-slate-400">
        Secure cookie-based access
      </div>
    </aside>
  );
}
