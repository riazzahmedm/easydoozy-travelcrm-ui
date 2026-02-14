import { notFound, redirect } from "next/navigation";
import { getServerPlanById } from "@/lib/server-plans-api";
import { PlanForm } from "../plan-form";

export default async function EditPlanPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const result = await getServerPlanById(id);

  if (result.status === 401 || result.status === 403) {
    redirect("/login");
  }

  if (!result.plan) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit Plan</h1>
      <p className="text-sm text-muted-foreground">
          Configure subscription limits and features.
        </p>
      <PlanForm initialData={result.plan} />
    </div>
  );
}
