"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenantDashboard } from "@/lib/tenant-dashboard-api";
import { Card } from "@/components/ui/card";
import { UsageBar } from "./usage-bar";
import { useAuth } from "@/hooks/useAuth";

export function DashboardClient() {
   const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["tenant-dashboard"],
    queryFn: getTenantDashboard,
  });

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const stats = data?.stats;
  const subscription = data?.subscription;

  const limits = subscription?.plan?.limits ?? {};

  return (
    <div className="space-y-8">

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {user?.role !== "AGENT" && <StatCard title="Agents" value={stats.agents} />}
        <StatCard title="Destinations" value={stats.destinations} />
        <StatCard title="Packages" value={stats.packages} />
        <StatCard title="Published" value={stats.publishedPackages} />
      </div>

      {/* USAGE SECTION */}
      {subscription && user?.role !== "AGENT" && (
        <Card className="p-6 space-y-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Subscription Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                Plan: {subscription.plan.name}
              </p>
            </div>

            <div className="text-sm font-medium">
              Status: {subscription.status}
            </div>
          </div>

          <div className="space-y-4">
            <UsageBar
              label="Agents"
              used={stats.agents}
              max={limits.maxAgents}
            />

            <UsageBar
              label="Destinations"
              used={stats.destinations}
              max={limits.maxDestinations}
            />

            <UsageBar
              label="Packages"
              used={stats.packages}
              max={limits.maxPackages}
            />
          </div>
        </Card>
      )}

      {/* DRAFT VS PUBLISHED */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">
          Package Status
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <StatusBox
            title="Draft"
            value={stats.draftPackages}
            color="bg-yellow-100 text-yellow-800"
          />

          <StatusBox
            title="Published"
            value={stats.publishedPackages}
            color="bg-emerald-100 text-emerald-800"
          />
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <Card className="p-6 bg-white">
      <div className="text-sm text-muted-foreground">
        {title}
      </div>
      <div className="text-2xl font-semibold mt-2">
        {value}
      </div>
    </Card>
  );
}

function StatusBox({ title, value, color }: any) {
  return (
    <div className={`rounded-xl p-6 ${color}`}>
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-semibold mt-2">
        {value}
      </div>
    </div>
  );
}
