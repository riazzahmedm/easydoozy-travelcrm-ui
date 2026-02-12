"use client";

export function TenantUsage({ tenant }: any) {
  const limits = tenant.subscription?.plan?.limits;

  if (!limits) {
    return (
      <div className="bg-white rounded border p-6 text-sm text-muted-foreground">
        No subscription assigned
      </div>
    );
  }

  const agentsUsed = tenant._count.users;
  const destinationsUsed = tenant._count.destinations;
  const packagesUsed = tenant._count.packages;

  return (
    <div className="bg-white rounded border p-6 space-y-6">
      <h3 className="font-semibold text-lg">Usage</h3>

      <UsageBar
        label="Agents"
        used={agentsUsed}
        limit={limits.maxAgents}
      />

      <UsageBar
        label="Destinations"
        used={destinationsUsed}
        limit={limits.maxDestinations}
      />

      <UsageBar
        label="Packages"
        used={packagesUsed}
        limit={limits.maxPackages}
      />
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percentage = limit
    ? Math.min((used / limit) * 100, 100)
    : 0;

  const isNearLimit = percentage >= 80 && percentage < 100;
  const isLimitReached = percentage >= 100;

  const barColor = isLimitReached
    ? "bg-red-500"
    : isNearLimit
    ? "bg-orange-500"
    : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {used} / {limit}
        </span>
      </div>

      <div className="w-full h-2 bg-muted rounded overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isLimitReached && (
        <div className="text-xs text-red-600">
          Limit reached
        </div>
      )}

      {isNearLimit && !isLimitReached && (
        <div className="text-xs text-orange-600">
          Near limit
        </div>
      )}
    </div>
  );
}
