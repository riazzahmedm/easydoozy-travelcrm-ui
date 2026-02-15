"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertLeadToBooking } from "@/lib/leads-api";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId: string;
  defaultPackageId?: string;
}

export function ConvertBookingModal({
  open,
  onClose,
  leadId,
  defaultPackageId,
}: Props) {
  const { push } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    packageId: defaultPackageId || "",
    totalAmount: 0,
    paidAmount: 0,
  });

  const mutation = useMutation({
    mutationFn: () =>
      convertLeadToBooking(leadId, form),
    onSuccess: () => {
      push({
        title: "Booking created successfully",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      onClose();
    },
    onError: (err: any) => {
      push({
        title:
          err?.response?.data?.message ||
          "Failed to convert lead",
        variant: "error",
      });
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl space-y-6">

        <h2 className="text-lg font-semibold">
          Convert to Booking
        </h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Total Amount
          </label>
          <Input
            type="number"
            value={form.totalAmount}
            onChange={(e) =>
              setForm({
                ...form,
                totalAmount: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Paid Amount
          </label>
          <Input
            type="number"
            value={form.paidAmount}
            onChange={(e) =>
              setForm({
                ...form,
                paidAmount: Number(e.target.value),
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
            {mutation.isPending
              ? "Creating..."
              : "Create Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
