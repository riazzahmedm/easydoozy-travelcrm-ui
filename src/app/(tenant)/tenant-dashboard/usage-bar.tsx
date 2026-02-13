export function UsageBar({
  label,
  used,
  max,
}: {
  label: string;
  used: number;
  max?: number;
}) {
  if (!max) {
    return (
      <div>
        <div className="text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">
          Unlimited
        </div>
      </div>
    );
  }

  const percentage = Math.min(
    100,
    Math.round((used / max) * 100)
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {used} / {max}
        </span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${
            percentage > 90
              ? "bg-red-500"
              : percentage > 70
              ? "bg-yellow-500"
              : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
