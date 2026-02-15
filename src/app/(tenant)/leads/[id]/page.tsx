import { getServerLeadById } from "@/lib/server-leads-api";
import { redirect } from "next/navigation";
import { LeadForm } from "../lead-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const lead = await getServerLeadById(id);
  const [convertOpen, setConvertOpen] = useState(false)

  if (!lead) {
    redirect("/leads");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold"> Edit Lead</h1>
          <p className="text-sm text-muted-foreground">
            Update inquiry details
          </p>
        </div>

        <Button
          onClick={() => setConvertOpen(true)}
        >
          Convert to Booking
        </Button>
      </div>

      <LeadForm
        mode="edit"
        initialData={lead}
      />
    </div>
  );
}
