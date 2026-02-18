import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadStatus, updateLeadStatus } from "@/lib/leads-api";
import { useToast } from "@/components/ui/toast";
import { formatApiError } from "@/lib/utils";

type LeadRow = {
  id: string;
  status: LeadStatus;
};

export function LeadActions({ lead }: { lead: LeadRow }) {
  const queryClient = useQueryClient();
  const { push } = useToast();

  const mutation = useMutation({
    mutationFn: (status: LeadStatus) =>
      updateLeadStatus(lead.id, status),
    onSuccess: () => {
      push({
        title: "Lead status updated",
        description: "Lead status was updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lead-audit-logs", lead.id],
      });
    },
    onError: (err: unknown) => {
      push({
        title: "Status update failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <select
      className="border rounded px-2 py-1 text-xs"
      value={lead.status}
      onChange={(e) => mutation.mutate(e.target.value as LeadStatus)}
      disabled={mutation.isPending}
    >
      <option value="NEW">NEW</option>
      <option value="CONTACTED">CONTACTED</option>
      <option value="QUALIFIED">QUALIFIED</option>
      <option value="WON">WON</option>
      <option value="LOST">LOST</option>
    </select>
  );
}
