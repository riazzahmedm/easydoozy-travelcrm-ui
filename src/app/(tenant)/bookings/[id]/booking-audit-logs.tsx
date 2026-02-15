"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingAuditLogs } from "@/lib/bookings-api";

type AuditLog = {
  id: string;
  action: string;
  createdAt: string;
  metadata?: unknown;
  actor?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export function BookingAuditLogs({ bookingId }: { bookingId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["booking-audit-logs", bookingId],
    queryFn: () => getBookingAuditLogs(bookingId),
  });

  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        Loading activity...
      </section>
    );
  }

  const logs = (data ?? []) as AuditLog[];

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-base font-semibold">Activity Log</h2>

      {!logs.length && (
        <div className="text-sm text-muted-foreground">
          No activity yet.
        </div>
      )}

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border bg-muted/20 px-4 py-3 text-sm"
          >
            <div className="font-medium">
              {log.action.replaceAll("_", " ")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(log.createdAt).toLocaleString()} •{" "}
              {log.actor?.name || log.actor?.email || "System"}
            </div>
            {Boolean(log.metadata) && (
              <pre className="mt-2 rounded-md border bg-white p-2 text-xs overflow-x-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
