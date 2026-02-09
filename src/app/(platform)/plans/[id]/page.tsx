import { getPlanById } from "@/lib/plans-api";
import { PlanForm } from "../plan-form";

export default async function EditPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const plan = await getPlanById(params.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Edit Plan
      </h1>
      <PlanForm initialData={plan} />
    </div>
  );
}
