import { Card } from "@/components/ui/card";

type OverviewData = {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  totalAgents: number;
  totalDestinations: number;
  totalPackages: number;
  publishedPackages: number;
  totalLeads: number;
};

export function DashboardOverview({ data }: { data: OverviewData }) {
  const items = [
    { label: "Total Tenants", value: data.totalTenants },
    { label: "Active Tenants", value: data.activeTenants },
    { label: "Suspended Tenants", value: data.suspendedTenants },
    { label: "Agents", value: data.totalAgents },
    { label: "Leads", value: data.totalLeads },
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
