"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlans } from "@/lib/plans-api";
import { assignSubscription } from "@/lib/subscriptions-api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Plan, TenantDetails } from "@/types/api";
import { formatApiError } from "@/lib/utils";

export function TenantPlan({ tenant }: { tenant: TenantDetails }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();
  const { push } = useToast();

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const mutation = useMutation({
    mutationFn: () =>
      assignSubscription({
        tenantId: tenant.id,
        planId: selectedPlan!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tenant", tenant.id],
      });
      push({
        title: "Plan updated",
        description: "Subscription plan changed successfully",
        variant: "success",
      });
      setOpen(false);
      setSelectedPlan(null);
      router.refresh();
    },
    onError: (err: unknown) => {
      push({
        title: "Plan update failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  const currentPlanId = tenant.subscription?.plan?.id;

  return (
    <div className="bg-white rounded border p-6 space-y-4">
      <h3 className="font-semibold text-lg">Subscription</h3>

      {tenant.subscription ? (
        <div className="text-sm space-y-1">
          <div>
            Current Plan:{" "}
            <span className="font-medium">
              {tenant.subscription.plan?.name}
            </span>
          </div>

          <div>
            Status:{" "}
            <span className="font-medium">
              {tenant.subscription.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No subscription assigned
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Change Plan
      </Button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <h4 className="font-semibold text-lg">
              Select New Plan
            </h4>

            <div className="space-y-2">
              {plans?.map((plan: Plan) => {
                const isCurrent =
                  plan.id === currentPlanId;

                return (
                  <div
                    key={plan.id}
                    className={`border rounded p-3 cursor-pointer ${selectedPlan === plan.id
                      ? "border-primary"
                      : "border-muted"
                      }`}
                    onClick={() =>
                      setSelectedPlan(plan.id)
                    }
                  >
                    <div className="font-medium">
                      {plan.name}
                      {isCurrent && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Current)
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Agents: {plan.limits?.maxAgents} ·
                      Destinations: {plan.limits?.maxDestinations} ·
                      Packages: {plan.limits?.maxPackages}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={
                  !selectedPlan ||
                  selectedPlan === currentPlanId ||
                  mutation.isPending
                }
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending
                  ? "Updating..."
                  : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
