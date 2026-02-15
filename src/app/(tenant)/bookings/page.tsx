"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/lib/bookings-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookingsTable } from "./bookings-table";

export default function BookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer bookings
          </p>
        </div>
{/* 
        <Button asChild>
          <Link href="/bookings/new">Add Bookings</Link>
        </Button> */}
      </div>

      <BookingsTable />
    </div>
  );
}
