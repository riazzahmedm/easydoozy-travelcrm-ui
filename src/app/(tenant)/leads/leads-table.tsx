"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeads, LeadStatus } from "@/lib/leads-api";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadActions } from "./lead-actions";
import { Button } from "@/components/ui/button";
import { ConvertBookingModal } from "@/components/leads/convert-booking-modal";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeadRow = {
  id: string;
  name: string;
  phone?: string | null;
  budget?: number | null;
  status: LeadStatus;
  packageId?: string | null;
  destinationId?: string | null;
  assignedTo?: {
    name?: string | null;
  } | null;
};

export function LeadsTable() {
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
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
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Name</TableHead>
            <TableHead className="p-3 text-left font-semibold">Phone</TableHead>
            <TableHead className="p-3 text-left font-semibold">Budget</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-3 text-left font-semibold">Assigned</TableHead>
            <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(data as LeadRow[]).map((lead) => (
            <TableRow key={lead.id} className="border-t hover:bg-muted/20">
              <TableCell className="p-3 font-medium">{lead.name}</TableCell>
              <TableCell className="p-3">{lead.phone || "-"}</TableCell>
              <TableCell className="p-3">
                ₹{lead.budget?.toLocaleString() ?? "-"}
              </TableCell>
              <TableCell className="p-3">
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="p-3">{lead.assignedTo?.name ?? "-"}</TableCell>
              <TableCell className="p-3 text-right">
                <div className="flex justify-end gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link href={`/leads/${lead.id}`}>Edit</Link>
                </Button>
                {lead.status !== "WON" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                  >
                    Convert
                  </Button>
                )}
                <LeadActions lead={{ id: lead.id, status: lead.status }} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConvertBookingModal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        leadId={selectedLead?.id ?? ""}
        defaultPackageId={selectedLead?.packageId ?? undefined}
        defaultDestinationId={selectedLead?.destinationId ?? undefined}
      />
    </div>
  );
}
