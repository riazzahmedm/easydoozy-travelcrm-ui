import { Card } from "@/components/ui/card";

export function DashboardOverview({ data }: any) {
  const items = [
    { label: "Total Tenants", value: data.totalTenants },
    { label: "Active Tenants", value: data.activeTenants },
    { label: "Suspended Tenants", value: data.suspendedTenants },
    { label: "Agents", value: data.totalAgents },
    { label: "Destinations", value: data.totalDestinations },
    { label: "Packages", value: data.totalPackages },
    { label: "Published Packages", value: data.publishedPackages },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="p-5 border bg-white shadow-sm rounded-xl"
        >
          <div className="text-xs text-muted-foreground">
            {item.label}
          </div>
          <div className="text-2xl font-semibold mt-1">
            {item.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
