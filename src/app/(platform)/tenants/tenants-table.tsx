"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/lib/tenants-api";
import { TenantStatusBadge } from "./tenant-status-badge";
import { TenantActions } from "./tenant-actions";
import { TenantDetails } from "@/types/api";

export function TenantsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded border p-6">
        Loading tenants...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded border p-6 text-sm text-muted-foreground">
        No tenants created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left">Tenant</th>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Users</th>
            <th className="p-3 text-left">Destinations</th>
            <th className="p-3 text-left">Packages</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((tenant: TenantDetails) => {
            const isPlatform = tenant.slug === "platform";

            return (
              <tr
                key={tenant.id}
                className={`
          border-t transition-colors
          ${isPlatform ? "bg-muted/40 opacity-70" : "hover:bg-muted/40"}
        `}
              >
                {/* Tenant */}
                <td className="p-3 font-medium">
                  {tenant.name}
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {tenant.slug}
                    {isPlatform && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                        SYSTEM
                      </span>
                    )}
                  </div>
                </td>

                {/* Plan */}
                <td className="p-3">
                  {!isPlatform && (tenant.subscription?.plan ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {tenant.subscription.plan.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {tenant.subscription.status}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-rose-500">
                      No Plan
                    </span>
                  ))}
                </td>

                <td className="p-3">{tenant._count.users}</td>
                <td className="p-3">{tenant._count.destinations}</td>
                <td className="p-3">{tenant._count.packages}</td>

                <td className="p-3">
                  <TenantStatusBadge status={tenant.status} />
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  {!isPlatform && (
                    <TenantActions tenant={tenant} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
