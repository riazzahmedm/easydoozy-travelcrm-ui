import { Card } from "@/components/ui/card";

type BookingSummaryData = {
  confirmedBookings: number;
  partialPaidBookings: number;
  fullyPaidBookings: number;
  cancelledBookings: number;
  bookingTotalAmount: number;
  bookingPaidAmount: number;
  bookingDueAmount: number;
};

function formatCurrency(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function DashboardBookings({
  data,
}: {
  data: BookingSummaryData;
}) {
  const statusItems = [
    { label: "Confirmed", value: data.confirmedBookings, color: "bg-blue-100 text-blue-800" },
    { label: "Partial", value: data.partialPaidBookings, color: "bg-amber-100 text-amber-800" },
    { label: "Fully Paid", value: data.fullyPaidBookings, color: "bg-emerald-100 text-emerald-800" },
    { label: "Cancelled", value: data.cancelledBookings, color: "bg-rose-100 text-rose-800" },
  ];

  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-medium">Booking Summary</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusItems.map((item) => (
          <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
            <div className="text-xs">{item.label}</div>
            <div className="text-2xl font-semibold mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric title="Total Amount" value={formatCurrency(data.bookingTotalAmount)} />
        <Metric title="Collected" value={formatCurrency(data.bookingPaidAmount)} />
        <Metric title="Outstanding" value={formatCurrency(data.bookingDueAmount)} />
      </div>
    </Card>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
