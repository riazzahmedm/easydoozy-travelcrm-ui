import { LeadForm } from "../lead-form";

export default function CreateLeadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Lead</h1>
        <p className="text-sm text-muted-foreground">
          Capture new inquiry details
        </p>
      </div>

      <LeadForm mode="create" />
    </div>
  );
}
