"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenantStatus } from "@/lib/tenants-api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function TenantOverview({ tenant }: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { push } = useToast();
  const tenantAdmin = tenant?.users?.[0];
  const brandColor = tenant?.color || "#0f172a";

  const mutation = useMutation({
    mutationFn: () =>
      updateTenantStatus(
        tenant.id,
        tenant.status === "ACTIVE"
          ? "SUSPENDED"
          : "ACTIVE"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
      push({
        title:
          tenant.status === "ACTIVE"
            ? "Tenant suspended"
            : "Tenant activated",
        description: `${tenant.name} status updated successfully`,
        variant: "success",
      });
      router.refresh();
    },
    onError: () => {
      push({
        title: "Update failed",
        description: "Could not update tenant status",
        variant: "error",
      });
    },
  });

  return (
    <div className="bg-white rounded-xl border p-6 flex justify-between items-start gap-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl overflow-hidden border bg-slate-100 flex items-center justify-center">
          {tenant.logo ? (
            <img
              src={tenant.logo}
              alt={`${tenant.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: brandColor }}
            >
              {tenant.name?.[0] ?? "T"}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold">{tenant.name}</h2>
          <div className="text-sm text-muted-foreground">
            {tenant.slug}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge
              className={
                tenant.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {tenant.status}
            </Badge>
            <span className="text-xs text-slate-500">
              Brand
            </span>
            <span
              className="inline-block h-4 w-4 rounded-full border"
              style={{ backgroundColor: brandColor }}
              title={brandColor}
            />
            <span className="text-xs font-mono text-slate-500">
              {brandColor}
            </span>
          </div>

          <div className="mt-4 grid gap-1 text-sm">
            <div>
              <span className="text-slate-500">
                Admin name:
              </span>{" "}
              <span className="font-medium">
                {tenantAdmin?.name ?? "Not set"}
              </span>
            </div>
            <div>
              <span className="text-slate-500">
                Admin email:
              </span>{" "}
              <span className="font-medium">
                {tenantAdmin?.email ?? "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending
          ? "Updating..."
          : tenant.status === "ACTIVE"
            ? "Suspend"
            : "Activate"}
      </Button>
    </div>
  );
}
