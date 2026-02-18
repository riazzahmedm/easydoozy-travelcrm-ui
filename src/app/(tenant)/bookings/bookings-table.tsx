"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getBookings } from "@/lib/bookings-api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Customer</TableHead>
            <TableHead className="p-3 text-left font-semibold">Destination</TableHead>
            <TableHead className="p-3 text-left font-semibold">Package</TableHead>
            <TableHead className="p-3 text-left font-semibold">Total</TableHead>
            <TableHead className="p-3 text-left font-semibold">Paid</TableHead>
            <TableHead className="p-3 text-left font-semibold">Due</TableHead>
            <TableHead className="p-3 text-left font-semibold">Payment</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((booking: any) => {
            const due =
              Number(booking.totalAmount) -
              Number(booking.paidAmount);

            return (
              <TableRow
                key={booking.id}
                className="border-t hover:bg-muted/20 transition"
              >
                <TableCell className="p-3 font-medium">
                  {booking.lead.name}
                  <div className="text-xs text-muted-foreground">
                    {booking.lead.email}
                  </div>
                </TableCell>

                <TableCell className="p-3">
                  {booking.destination?.name ?? "-"}
                </TableCell>

                <TableCell className="p-3">
                  {booking.package?.name ?? "-"}
                </TableCell>

                <TableCell className="p-3">
                  {formatCurrency(booking.totalAmount)}
                </TableCell>

                <TableCell className="p-3">
                  {formatCurrency(booking.paidAmount)}
                </TableCell>

                <TableCell className="p-3 font-medium">
                  {formatCurrency(due)}
                </TableCell>

                <TableCell className="p-3">
                  <PaymentBadge
                    total={booking.totalAmount}
                    paid={booking.paidAmount}
                  />
                </TableCell>

                <TableCell className="p-3">
                  <StatusBadge status={booking.status} />
                </TableCell>

                <TableCell className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/bookings/${booking.id}`)
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
