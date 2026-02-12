import { getServerTenantById } from "@/lib/server-tenants-api";
import { TenantOverview } from "./tenant-overview";
import { TenantUsage } from "./tenant-usage";
import { TenantPlan } from "./tenant-plan";

export default async function TenantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tenant = await getServerTenantById(id);

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="space-y-6">
      <TenantOverview tenant={tenant} />
      <TenantUsage tenant={tenant} />
      <TenantPlan tenant={tenant} />
    </div>
  );
}
