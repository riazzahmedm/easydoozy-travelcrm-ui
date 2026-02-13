"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

export function DashboardSubscriptions({ data }: any) {
  const chartData = [
    { name: "Active", value: data.activeSubscriptions },
    { name: "Trial", value: data.trialSubscriptions },
    { name: "Suspended", value: data.suspendedSubscriptions },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-4">
        Subscription Distribution
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
