"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  BookingStatus,
  updateBooking,
  updateBookingStatus,
} from "@/lib/bookings-api";
import { formatApiError } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  booking: {
    id: string;
    status: BookingStatus;
    totalAmount: number;
    paidAmount: number;
    travelDate?: string | null;
    travelers?: number | null;
  };
};

export function BookingActions({ booking }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    totalAmount: String(booking.totalAmount ?? ""),
    paidAmount: String(booking.paidAmount ?? ""),
    travelDate: booking.travelDate
      ? booking.travelDate.split("T")[0]
      : "",
    travelers:
      typeof booking.travelers === "number"
        ? String(booking.travelers)
        : "",
  });
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const totalAmount = Number(form.totalAmount);
      const paidAmount = Number(form.paidAmount);
      const travelers = form.travelers ? Number(form.travelers) : undefined;

      if (!form.totalAmount || Number.isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("Total amount must be greater than 0");
      }
      if (Number.isNaN(paidAmount) || paidAmount < 0) {
        throw new Error("Paid amount cannot be negative");
      }
      if (paidAmount > totalAmount) {
        throw new Error("Paid amount cannot exceed total amount");
      }

      return updateBooking(booking.id, {
        totalAmount,
        paidAmount,
        travelDate: form.travelDate || undefined,
        travelers,
      });
    },
    onSuccess: () => {
      push({
        title: "Booking updated",
        description: "Booking details updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking-audit-logs", booking.id],
      });
      router.refresh();
      setOpen(false);
    },
    onError: (err: unknown) => {
      push({
        title: "Update failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (nextStatus: BookingStatus) =>
      updateBookingStatus(booking.id, nextStatus),
    onSuccess: () => {
      push({
        title: "Status updated",
        description: "Booking status updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking-audit-logs", booking.id],
      });
      router.refresh();
      setOpen(false);
    },
    onError: (err: unknown) => {
      push({
        title: "Status update failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Update Booking</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Booking</DialogTitle>
            <DialogDescription>
              Update booking details and status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Amount</label>
                <Input
                  type="number"
                  value={form.totalAmount}
                  onChange={(e) =>
                    setForm({ ...form, totalAmount: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Paid Amount</label>
                <Input
                  type="number"
                  value={form.paidAmount}
                  onChange={(e) =>
                    setForm({ ...form, paidAmount: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Travel Date</label>
                <Input
                  type="date"
                  value={form.travelDate}
                  onChange={(e) =>
                    setForm({ ...form, travelDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Travelers</label>
                <Input
                  type="number"
                  value={form.travelers}
                  onChange={(e) =>
                    setForm({ ...form, travelers: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                disabled={updateMutation.isPending}
                onClick={() => updateMutation.mutate()}
              >
                {updateMutation.isPending ? "Saving..." : "Save Booking"}
              </Button>
            </div>

            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold">Update Status</h3>
              <div className="flex gap-3 items-center">
                <select
                  className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PARTIAL_PAID">PARTIAL PAID</option>
                  <option value="FULLY_PAID">FULLY PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <Button
                  variant="outline"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(status)}
                >
                  {statusMutation.isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
