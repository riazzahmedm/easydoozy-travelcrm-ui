import { Badge } from "@/components/ui/badge";

export function PlanStatus({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      className={
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
