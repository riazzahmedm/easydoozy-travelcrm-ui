"use client";

import { BookingsTable } from "./bookings-table";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer bookings
          </p>
        </div>
      </div>

      <BookingsTable />
    </div>
  );
}
