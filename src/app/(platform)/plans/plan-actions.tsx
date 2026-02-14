"use client";

import { togglePlanStatus } from "@/lib/plans-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plan } from "@/types/api";
import { useToast } from "@/components/ui/toast";
import { formatApiError } from "@/lib/utils";

export function PlanActions({ plan }: { plan: Plan }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { push } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      togglePlanStatus(plan.id, !plan.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      push({
        title: "Plan status updated",
        description: `Plan is now ${plan.isActive ? "inactive" : "active"}.`,
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
    <div className="flex justify-end gap-4 items-center">
      {/* Edit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsNavigating(true);
          router.push(`/plans/${plan.id}`);
        }}
      >
        {isNavigating ? (
          <Spinner className="text-slate-600" size={14} />
        ) : ("Edit")}
      </Button>

      {/* Active / Inactive */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {plan.isActive
          ? "Suspend"
          : "Activate"}
      </Button>
    </div>
  );
}
