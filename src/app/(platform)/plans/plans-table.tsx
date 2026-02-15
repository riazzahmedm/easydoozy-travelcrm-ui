"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/lib/plans-api";
import { PlanActions } from "./plan-actions";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/types/api";

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
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Destinations</th>
            <th className="p-3 text-left">Packages</th>
            <th className="p-3 text-left">Agents</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((plan: Plan) => (
            <tr key={plan.id} className="border-t">
              <td className="p-3 font-medium">{plan.name}</td>
              <td className="p-3">{plan.limits?.maxDestinations}</td>
              <td className="p-3">{plan.limits?.maxPackages}</td>
              <td className="p-3">{plan.limits?.maxAgents}</td>
              <td className="p-3">
                <Badge
                  className={
                    plan.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
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
