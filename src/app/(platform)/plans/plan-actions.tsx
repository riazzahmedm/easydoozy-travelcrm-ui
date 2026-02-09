"use client";

import { Button } from "@/components/ui/button";
import { togglePlanStatus } from "@/lib/plans-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function PlanActions({ plan }: { plan: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      togglePlanStatus(plan.id, !plan.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
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
        disabled={isNavigating}
      >
        {isNavigating ? (
          <>
            <Spinner className="text-white" size={14} />
            Loading...
          </>
        ) : (
          "Edit"
        )}
      </Button>

      {/* Active / Inactive */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {plan.isActive ? "Active" : "Inactive"}
        </span>
        <Switch
          checked={plan.isActive}
          onCheckedChange={() => mutation.mutate()}
          disabled={mutation.isPending}
        />
      </div>
    </div>
  );
}
