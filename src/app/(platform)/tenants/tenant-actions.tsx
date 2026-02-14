"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenantStatus } from "@/lib/tenants-api";
import { useRouter } from "next/navigation";
import { TenantDetails } from "@/types/api";
import { useToast } from "@/components/ui/toast";
import { formatApiError } from "@/lib/utils";

export function TenantActions({
  tenant,
}: {
  tenant: TenantDetails;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
        title: "Tenant status updated",
        description: `${tenant.name} is now ${tenant.status === "ACTIVE" ? "suspended" : "active"}.`,
        variant: "success",
      });
    },
    onError: (err: unknown) => {
      push({
        title: "Status update failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/tenants/${tenant.id}`)}
      >
        View
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {tenant.status === "ACTIVE"
          ? "Suspend"
          : "Activate"}
      </Button>
    </div>
  );
}
