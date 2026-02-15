import { getServerLeadById } from "@/lib/server-leads-api";
import { redirect } from "next/navigation";
import { LeadForm } from "../lead-form";

interface Props {
  params: { id: string };
}

export default async function EditLeadPage({ params }: Props) {
  const lead = await getServerLeadById(params.id);

  if (!lead) {
    redirect("/leads");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Edit Lead
        </h1>
        <p className="text-sm text-muted-foreground">
          Update inquiry details
        </p>
      </div>

      <LeadForm
        mode="edit"
        initialData={lead}
      />
    </div>
  );
}
