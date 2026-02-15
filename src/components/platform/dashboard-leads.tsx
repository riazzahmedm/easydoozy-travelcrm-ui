import { Card } from "@/components/ui/card";

type LeadsData = {
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
};

export function DashboardLeads({ data }: { data: LeadsData }) {
  const items = [
    { label: "New", value: data.newLeads, color: "bg-blue-100 text-blue-800" },
    { label: "Contacted", value: data.contactedLeads, color: "bg-violet-100 text-violet-800" },
    { label: "Qualified", value: data.qualifiedLeads, color: "bg-amber-100 text-amber-800" },
    { label: "Won", value: data.wonLeads, color: "bg-emerald-100 text-emerald-800" },
    { label: "Lost", value: data.lostLeads, color: "bg-rose-100 text-rose-800" },
  ];

  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-4">Lead Status</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className={`rounded-xl p-4 ${item.color}`}>
            <div className="text-xs">{item.label}</div>
            <div className="text-2xl font-semibold mt-1">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
