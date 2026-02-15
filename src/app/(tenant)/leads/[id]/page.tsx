import { getServerLeadById } from "@/lib/server-leads-api";
import { redirect } from "next/navigation";
import { LeadForm } from "../lead-form";
import { LeadAuditLogs } from "../lead-audit-logs";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const lead = await getServerLeadById(id);

  if (!lead) {
    redirect("/leads");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Lead</h1>
        <p className="text-sm text-muted-foreground">
          Update inquiry details
        </p>
      </div>

      <LeadForm
        mode="edit"
        initialData={lead}
      />

      <LeadAuditLogs leadId={lead.id} />
    </div>
  );
}
