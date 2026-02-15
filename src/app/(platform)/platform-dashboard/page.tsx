"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlatformDashboard } from "@/lib/platform-dashboard-api";
import { DashboardOverview } from "@/components/platform/dashboard-overview";
import { DashboardGrowth } from "@/components/platform/dashboard-growth";
import { DashboardSubscriptions } from "@/components/platform/dashboard-subscriptions";
import { DashboardLeads } from "@/components/platform/dashboard-leads";

export default function PlatformDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["platform-dashboard"],
    queryFn: getPlatformDashboard,
  });

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6">Unable to load dashboard.</div>;
  }

  return (
    <div className="space-y-8">
      <DashboardOverview data={data.overview} />
      <DashboardLeads data={data.overview} />
      <DashboardGrowth growth={data.growth} />
      <DashboardSubscriptions data={data.subscriptions} />
    </div>
  );
}
