import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadStatus } from "@/lib/leads-api";

export function LeadActions({ lead }: any) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (status: string) =>
      updateLeadStatus(lead.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });

  return (
    <select
      className="border rounded px-2 py-1 text-xs"
      value={lead.status}
      onChange={(e) => mutation.mutate(e.target.value)}
    >
      <option value="NEW">NEW</option>
      <option value="CONTACTED">CONTACTED</option>
      <option value="QUALIFIED">QUALIFIED</option>
      <option value="WON">WON</option>
      <option value="LOST">LOST</option>
    </select>
  );
}
