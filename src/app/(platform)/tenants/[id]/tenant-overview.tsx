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
    <div className="bg-white rounded border p-6 flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold">
          {tenant.name}
        </h2>
        <div className="text-sm text-muted-foreground">
          {tenant.slug}
        </div>

        <div className="mt-2">
          <Badge
            className={
              tenant.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {tenant.status}
          </Badge>
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
