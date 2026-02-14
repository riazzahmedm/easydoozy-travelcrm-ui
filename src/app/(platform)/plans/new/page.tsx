import { PlanForm } from "../plan-form";

export default function CreatePlanPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Plan</h1>
      <p className="text-sm text-muted-foreground mb-5">
          Configure subscription limits and features.
        </p>
      <PlanForm />
    </div>
  );
}
