"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/lib/tenants-api";
import { TenantStatusBadge } from "./tenant-status-badge";
import { TenantActions } from "./tenant-actions";
import { TenantDetails } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TenantsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

   if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading tenants...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No tenants created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Tenant</TableHead>
            <TableHead className="p-3 text-left font-semibold">Plan</TableHead>
            <TableHead className="p-3 text-left font-semibold">Users</TableHead>
            <TableHead className="p-3 text-left font-semibold">Destinations</TableHead>
            <TableHead className="p-3 text-left font-semibold">Packages</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((tenant: TenantDetails) => {
            const isPlatform = tenant.slug === "platform";

            return (
              <TableRow
                key={tenant.id}
                className={`
          border-t transition-colors
          ${isPlatform ? "bg-muted/40 opacity-70" : "hover:bg-muted/40"}
        `}
              >
                {/* Tenant */}
                <TableCell className="p-3 font-medium">
                  {tenant.name}
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {tenant.slug}
                    {isPlatform && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                        SYSTEM
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Plan */}
                <TableCell className="p-3">
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
                </TableCell>

                <TableCell className="p-3">{tenant._count.users}</TableCell>
                <TableCell className="p-3">{tenant._count.destinations}</TableCell>
                <TableCell className="p-3">{tenant._count.packages}</TableCell>

                <TableCell className="p-3">
                  <TenantStatusBadge status={tenant.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="p-3 text-right">
                  {!isPlatform && (
                    <TenantActions tenant={tenant} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
