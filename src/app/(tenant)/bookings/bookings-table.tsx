"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getBookings } from "@/lib/bookings-api";

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
                <thead className="bg-muted/40">
                    <tr>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Package</th>
                        <th className="p-3 text-left">Total</th>
                        <th className="p-3 text-left">Paid</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((booking: any) => (
                        <tr key={booking.id} className="border-t">
                            <td className="p-3">
                                {booking.lead.name}
                            </td>
                            <td className="p-3">
                                {booking.package?.name}
                            </td>
                            <td className="p-3">
                                ₹{booking.totalAmount}
                            </td>
                            <td className="p-3">
                                ₹{booking.paidAmount}
                            </td>
                            <td className="p-3">
                                {booking.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
