import { TenantsTable } from "./tenants-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            Manage tenant accounts and subscriptions
          </p>
        </div>

        <Button asChild>
          <Link href="/tenants/new">Create Tenant</Link>
        </Button>
      </div>

      <TenantsTable />
    </div>
  );
}
