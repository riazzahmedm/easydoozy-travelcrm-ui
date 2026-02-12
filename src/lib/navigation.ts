import { UserRole } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
}

export const NAVIGATION: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: "Plans", href: "/plans" },
    { label: "Tenants", href: "/tenants" },
    // { label: "Subscriptions", href: "/subscriptions" },
  ],
  TENANT_ADMIN: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Agents", href: "/agents" },
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
    { label: "Subscription", href: "/subscription" },
  ],
  AGENT: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
  ],
};
