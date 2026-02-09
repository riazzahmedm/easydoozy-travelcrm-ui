"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/lib/navigation";
import clsx from "clsx";
import { AuthUser } from "@/lib/auth";

export function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const items = NAVIGATION[user.role];

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center px-6 font-semibold text-lg border-b">
        Travel CRM
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "block rounded px-3 py-2 text-sm",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
