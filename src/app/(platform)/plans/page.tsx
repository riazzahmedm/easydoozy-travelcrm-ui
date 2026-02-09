import { PlansTable } from "./plans-table";
import { CreatePlanButton } from "./create-plan-button";

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

        <CreatePlanButton />
      </div>

      <PlansTable />
    </div>
  );
}
