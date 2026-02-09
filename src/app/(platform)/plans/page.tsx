import { PlansTable } from "./plans-table";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plans</h1>
          <p className="text-muted-foreground text-sm">
            Manage subscription plans and usage limits
          </p>
        </div>

        <a
          href="/plans/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
        >
          Create Plan
        </a>
      </div>

      <PlansTable />
    </div>
  );
}
