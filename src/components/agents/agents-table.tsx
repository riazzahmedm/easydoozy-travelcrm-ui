"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgents, updateAgentStatus } from "@/lib/agents-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { formatApiError } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AgentItem = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

type UpdateAgentStatusInput = {
  id: string;
  isActive: boolean;
};

export function AgentsTable() {
  const { push } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const mutation = useMutation({
    mutationFn: ({ id, isActive }: UpdateAgentStatusInput) =>
      updateAgentStatus(id, isActive),
    onSuccess: () => {
      push({
        title: "Agent status updated",
        description: "Agent status was updated successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["agents"],
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading agents...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No agents created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Name</TableHead>
            <TableHead className="p-3 text-left font-semibold">Email</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-4 text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((agent: AgentItem) => (
            <TableRow key={agent.id} className="border-t">
              <TableCell className="p-3">{agent.name}</TableCell>
              <TableCell className="p-3">{agent.email}</TableCell>
              <TableCell className="p-3">
                <Badge
                  className={
                    agent.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="p-3 text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
