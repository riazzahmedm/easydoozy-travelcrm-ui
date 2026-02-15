import { redirect } from "next/navigation";
import { getServerBookingById } from "@/lib/server-bookings-api";

interface Props {
  params: Promise<{ id: string }>;
}

function formatCurrency(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-blue-100 text-blue-700",
    PARTIAL_PAID: "bg-amber-100 text-amber-700",
    FULLY_PAID: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default async function BookingDetailsPage({ params }: Props) {
  const { id } = await params;
  const booking = await getServerBookingById(id);

  if (!booking) {
    redirect("/bookings");
  }

  const total = booking.payment?.totalAmount ?? 0;
  const paid = booking.payment?.paidAmount ?? 0;
  const due = booking.payment?.dueAmount ?? 0;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Booking #{booking.id}</h1>
          <p className="text-sm text-muted-foreground">
            Complete booking, customer and payment information
          </p>
        </div>

        <StatusBadge status={booking.status} />
      </div>

      {/* PAYMENT SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Amount</div>
          <div className="text-xl font-semibold mt-1">
            {formatCurrency(total)}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-xs text-muted-foreground">Paid Amount</div>
          <div className="text-xl font-semibold mt-1 text-emerald-600">
            {formatCurrency(paid)}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-xs text-muted-foreground">Due Amount</div>
          <div
            className={`text-xl font-semibold mt-1 ${
              due > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatCurrency(due)}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BOOKING INFO */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold">Booking Info</h2>

          <div className="text-sm">
            <span className="text-muted-foreground">Travel Date:</span>{" "}
            {booking.travelDate
              ? new Date(booking.travelDate).toLocaleDateString()
              : "-"}
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Travelers:</span>{" "}
            {booking.travelers ?? "-"}
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Created At:</span>{" "}
            {new Date(booking.createdAt).toLocaleString()}
          </div>
        </section>

        {/* CUSTOMER INFO */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold">Customer</h2>

          <div className="text-sm">
            <span className="text-muted-foreground">Name:</span>{" "}
            {booking.customer?.name ?? "-"}
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            {booking.customer?.email ?? "-"}
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Phone:</span>{" "}
            {booking.customer?.phone ?? "-"}
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Assigned Agent:</span>{" "}
            {booking.customer?.assignedTo?.name ?? "-"}
          </div>
        </section>

        {/* DESTINATION & PACKAGE */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-4 md:col-span-2">
          <h2 className="text-base font-semibold">
            Destination & Package
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Destination:</span>{" "}
              {booking.destination?.name ?? "-"}
            </div>

            <div>
              <span className="text-muted-foreground">Package:</span>{" "}
              {booking.package?.name ?? "-"}
            </div>

            <div>
              <span className="text-muted-foreground">Duration:</span>{" "}
              {booking.package?.duration ?? "-"}
            </div>

            <div>
              <span className="text-muted-foreground">Base Price:</span>{" "}
              {typeof booking.package?.priceFrom === "number"
                ? formatCurrency(booking.package.priceFrom)
                : "-"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
