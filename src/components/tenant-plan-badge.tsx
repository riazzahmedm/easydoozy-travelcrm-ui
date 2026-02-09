import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export function TenantPlanBadge({
  plan,
  status,
}: {
  plan: string;
  status: string;
}) {
  return (
    <Badge
      className={clsx(
        "uppercase text-xs",
        status === "ACTIVE" && "bg-green-100 text-green-700",
        status === "TRIAL" && "bg-blue-100 text-blue-700",
        status === "SUSPENDED" && "bg-red-100 text-red-700"
      )}
    >
      {plan}
    </Badge>
  );
}
