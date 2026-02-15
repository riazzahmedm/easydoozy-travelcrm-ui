import { UserRole } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
}

export const NAVIGATION: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/platform-dashboard" },
    { label: "Plans", href: "/plans" },
    { label: "Tenants", href: "/tenants" },
    // { label: "Subscriptions", href: "/subscriptions" },
  ],
  TENANT_ADMIN: [
    { label: "Dashboard", href: "/tenant-dashboard" },
    { label: "Leads", href: "/leads" },
    { label: "Bookings", href: "/bookings" },
    { label: "Agents", href: "/agents" },
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
    { label: "Tags", href: "/tags" },
    { label: "Subscription", href: "/subscription" },
  ],
  AGENT: [
    { label: "Dashboard", href: "/tenant-dashboard" },
    { label: "Destinations", href: "/destinations" },
    { label: "Packages", href: "/packages" },
  ],
};
