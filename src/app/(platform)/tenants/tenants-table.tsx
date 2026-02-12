"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/lib/tenants-api";
import { TenantStatusBadge } from "./tenant-status-badge";
import { TenantActions } from "./tenant-actions";

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
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Tenant</th>
            <th className="p-3 text-left">Users</th>
            <th className="p-3 text-left">Destinations</th>
            <th className="p-3 text-left">Packages</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((tenant: any) => (
            <tr key={tenant.id} className="border-t">
              <td className="p-3 font-medium">
                {tenant.name}
                <div className="text-xs text-muted-foreground">
                  {tenant.slug}
                </div>
              </td>

              <td className="p-3">{tenant._count.users}</td>
              <td className="p-3">{tenant._count.destinations}</td>
              <td className="p-3">{tenant._count.packages}</td>

              <td className="p-3">
                <TenantStatusBadge status={tenant.status} />
              </td>

              <td className="p-3 text-right">
                <TenantActions tenant={tenant} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
