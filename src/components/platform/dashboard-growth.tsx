"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

type GrowthPoint = {
  month: string;
  count: number;
};

type GrowthData = {
  tenants: GrowthPoint[];
  packages: GrowthPoint[];
  leads: GrowthPoint[];
};

export function DashboardGrowth({ growth }: { growth: GrowthData }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-4">
          Tenant Growth
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growth.tenants}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-4">
          Lead Growth
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growth.leads}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-sm font-medium mb-4">
          Package Growth
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={growth.packages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      
    </div>
  );
}
