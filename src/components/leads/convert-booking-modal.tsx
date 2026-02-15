"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertLeadToBooking } from "@/lib/leads-api";
import { getDestinations } from "@/lib/destinations-api";
import { getPackages } from "@/lib/packages-api";
import { formatApiError } from "@/lib/utils";

type OptionItem = {
  id: string;
  name: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  leadId: string;
  defaultPackageId?: string;
  defaultDestinationId?: string;
}

export function ConvertBookingModal({
  open,
  onClose,
  leadId,
  defaultPackageId,
  defaultDestinationId,
}: Props) {
  const { push } = useToast();
  const queryClient = useQueryClient();

  const { data: destinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const [form, setForm] = useState({
    packageId: defaultPackageId || "",
    destinationId: defaultDestinationId || "",
    totalAmount: "",
    paidAmount: "0",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      packageId: defaultPackageId || "",
      destinationId: defaultDestinationId || "",
      totalAmount: "",
      paidAmount: "0",
    });
  }, [open, defaultPackageId, defaultDestinationId]);

  const mutation = useMutation({
    mutationFn: () => {
      const totalAmount = Number(form.totalAmount);
      const paidAmount = Number(form.paidAmount || 0);

      if (!form.totalAmount || Number.isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("Total amount must be greater than 0");
      }

      if (Number.isNaN(paidAmount) || paidAmount < 0) {
        throw new Error("Paid amount cannot be negative");
      }

      if (paidAmount > totalAmount) {
        throw new Error("Paid amount cannot exceed total amount");
      }

      if (!form.packageId && !form.destinationId) {
        throw new Error("Destination or package is required");
      }

      return convertLeadToBooking(leadId, {
        packageId: form.packageId || undefined,
        destinationId: form.destinationId || undefined,
        totalAmount,
        paidAmount,
      });
    },
    onSuccess: () => {
      push({
        title: "Booking created",
        description: "Lead converted to booking successfully.",
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });

      onClose();
    },
    onError: (err: unknown) => {
      push({
        title: "Convert failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-semibold">Convert to Booking</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Destination</label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={form.destinationId}
            onChange={(e) =>
              setForm({ ...form, destinationId: e.target.value })
            }
          >
            <option value="">Select destination</option>
            {destinations?.map((d: OptionItem) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Package</label>
          <select
            className="w-full rounded-lg border px-3 py-2 text-sm"
            value={form.packageId}
            onChange={(e) =>
              setForm({ ...form, packageId: e.target.value })
            }
          >
            <option value="">Select package</option>
            {packages?.map((p: OptionItem) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Total Amount *</label>
          <Input
            type="number"
            value={form.totalAmount}
            onChange={(e) =>
              setForm({
                ...form,
                totalAmount: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Paid Amount</label>
          <Input
            type="number"
            value={form.paidAmount}
            onChange={(e) =>
              setForm({
                ...form,
                paidAmount: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
