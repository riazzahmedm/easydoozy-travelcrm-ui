"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgents, updateAgentStatus } from "@/lib/agents-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export function AgentsTable() {
  const { push } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const mutation = useMutation({
    mutationFn: ({ id, isActive }: any) =>
      updateAgentStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
    },
  });

  if (isLoading) {
    return <div>Loading agents...</div>;
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((agent: any) => (
            <tr key={agent.id} className="border-t">
              <td className="p-3">{agent.name}</td>
              <td className="p-3">{agent.email}</td>
              <td className="p-3">
                <Badge
                  className={
                    agent.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="p-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    mutation.mutate({
                      id: agent.id,
                      isActive: !agent.isActive,
                    })
                  }
                >
                  {agent.isActive
                    ? "Deactivate"
                    : "Activate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
