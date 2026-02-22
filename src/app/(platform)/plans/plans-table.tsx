"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/lib/plans-api";
import { PlanActions } from "./plan-actions";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PlansTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

   if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading plans...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No plans created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Plan</TableHead>
            <TableHead className="p-3 text-left font-semibold">Destinations</TableHead>
            <TableHead className="p-3 text-left font-semibold">Packages</TableHead>
            <TableHead className="p-3 text-left font-semibold">Agents</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((plan: Plan) => (
            <TableRow key={plan.id} className="border-t">
              <TableCell className="p-3 font-medium">{plan.name}</TableCell>
              <TableCell className="p-3">{plan.limits?.maxDestinations}</TableCell>
              <TableCell className="p-3">{plan.limits?.maxPackages}</TableCell>
              <TableCell className="p-3">{plan.limits?.maxAgents}</TableCell>
              <TableCell className="p-3">
                <Badge
                  className={
                    plan.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-3 text-right">
                <PlanActions plan={plan} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
