import { CreateTenantForm } from "./tenant-form";

export default function NewTenantPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Create Tenant
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new tenant and assign subscription
        </p>
      </div>

      <CreateTenantForm />
    </div>
  );
}
