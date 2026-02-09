"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/lib/plans-api";
import { PlanStatus } from "./plan-status";
import { PlanActions } from "./plan-actions";

export function PlansTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded border p-6">
        Loading plans...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded border p-6 text-sm text-muted-foreground">
        No plans created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Destinations</th>
            <th className="p-3 text-left">Packages</th>
            <th className="p-3 text-left">Agents</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((plan: any) => (
            <tr key={plan.id} className="border-t">
              <td className="p-3 font-medium">{plan.name}</td>
              <td className="p-3">{plan.limits?.maxDestinations}</td>
              <td className="p-3">{plan.limits?.maxPackages}</td>
              <td className="p-3">{plan.limits?.maxAgents}</td>
              <td className="p-3">
                <PlanStatus isActive={plan.isActive} />
              </td>
              <td className="p-3 text-right">
                <PlanActions plan={plan} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
