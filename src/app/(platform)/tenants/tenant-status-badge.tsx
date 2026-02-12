import { Badge } from "@/components/ui/badge";

export function TenantStatusBadge({
  status,
}: {
  status: "ACTIVE" | "SUSPENDED";
}) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <Badge className={styles}>
      {status}
    </Badge>
  );
}
