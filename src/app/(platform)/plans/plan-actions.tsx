"use client";

import { togglePlanStatus } from "@/lib/plans-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Pencil } from "lucide-react";

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
      <button
        type="button"
        onClick={() => {
          setIsNavigating(true);
          router.push(`/plans/${plan.id}`);
        }}
        disabled={isNavigating}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Edit plan"
      >
        {isNavigating ? (
          <Spinner className="text-slate-600" size={14} />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
      </button>

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
