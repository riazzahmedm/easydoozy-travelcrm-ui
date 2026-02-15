"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeads, LeadStatus } from "@/lib/leads-api";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadActions } from "./lead-actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type LeadRow = {
  id: string;
  name: string;
  phone?: string | null;
  budget?: number | null;
  status: LeadStatus;
  assignedTo?: {
    name?: string | null;
  } | null;
};

export function LeadsTable() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading leads...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Budget</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Assigned</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {(data as LeadRow[]).map((lead) => (
            <tr key={lead.id} className="border-t hover:bg-muted/20">
              <td className="p-3 font-medium">{lead.name}</td>
              <td className="p-3">{lead.phone || "-"}</td>
              <td className="p-3">
                ₹{lead.budget?.toLocaleString() ?? "-"}
              </td>
              <td className="p-3">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="p-3">{lead.assignedTo?.name ?? "-"}</td>
              <td className="p-3 text-right flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/leads/${lead.id}`
                      )
                    }
                  >
                    Edit
                  </Button>
                <LeadActions lead={{ id: lead.id, status: lead.status }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
