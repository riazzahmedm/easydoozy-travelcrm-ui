"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getBookings } from "@/lib/bookings-api";
import { Badge } from "@/components/ui/badge";

function formatCurrency(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function PaymentBadge({ total, paid }: any) {
  const due = Number(total) - Number(paid);

  if (paid <= 0)
    return <Badge variant="secondary">Pending</Badge>;

  if (due <= 0)
    return <Badge className="bg-emerald-100 text-emerald-700">Fully Paid</Badge>;

  return <Badge className="bg-amber-100 text-amber-700">Partial</Badge>;
}

function StatusBadge({ status }: any) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-700",
    PARTIAL_PAID: "bg-amber-100 text-amber-700",
    FULLY_PAID: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function BookingsTable() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading bookings...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No bookings yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Destination</th>
            <th className="p-4 text-left">Package</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Paid</th>
            <th className="p-4 text-left">Due</th>
            <th className="p-4 text-left">Payment</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((booking: any) => {
            const due =
              Number(booking.totalAmount) -
              Number(booking.paidAmount);

            return (
              <tr
                key={booking.id}
                className="border-t hover:bg-muted/20 transition"
              >
                <td className="p-4 font-medium">
                  {booking.lead.name}
                  <div className="text-xs text-muted-foreground">
                    {booking.lead.email}
                  </div>
                </td>

                <td className="p-4">
                  {booking.destination?.name ?? "-"}
                </td>

                <td className="p-4">
                  {booking.package?.name ?? "-"}
                </td>

                <td className="p-4">
                  {formatCurrency(booking.totalAmount)}
                </td>

                <td className="p-4">
                  {formatCurrency(booking.paidAmount)}
                </td>

                <td className="p-4 font-medium">
                  {formatCurrency(due)}
                </td>

                <td className="p-4">
                  <PaymentBadge
                    total={booking.totalAmount}
                    paid={booking.paidAmount}
                  />
                </td>

                <td className="p-4">
                  <StatusBadge status={booking.status} />
                </td>

                <td className="p-4 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/bookings/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
