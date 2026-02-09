"use client";

import { Button } from "@/components/ui/button";
import { togglePlanStatus } from "@/lib/plans-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function PlanActions({ plan }: { plan: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () =>
      togglePlanStatus(plan.id, !plan.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  return (
    <div className="flex justify-end gap-2">
      {/* Edit */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/plans/${plan.id}`)}
      >
        Edit
      </Button>

      {/* Enable / Disable */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {plan.isActive ? "Disable" : "Enable"}
      </Button>
    </div>
  );
}
