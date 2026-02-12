import { TenantsTable } from "./tenants-table";

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

        <a
          href="/tenants/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
        >
          Create Tenant
        </a>
      </div>

      <TenantsTable />
    </div>
  );
}
