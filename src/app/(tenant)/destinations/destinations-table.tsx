"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getDestinations } from "@/lib/destinations-api";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { deleteDestination } from "@/lib/destinations-api";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useQueryClient } from "@tanstack/react-query";

export function DestinationsTable({ ...props }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { push } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDestination,
    onSuccess: () => {
      push({
        title: "Destination deleted",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["destinations"],
      });

      setSelectedId(null);
    },
    onError: () => {
      push({
        title: "Failed to delete destination",
        variant: "error",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white border rounded p-6">
        Loading destinations...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-muted-foreground">
        No destinations created yet.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Tags</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-medium">
                  {item.name}
                </td>

                <td className="p-3">
                  {item.city}, {item.country}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.map((tag: any) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>

                <td className="p-3 text-right flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/destinations/${item.id}`
                      )
                    }
                  >
                    Edit
                  </Button>
                  {user?.role === "TENANT_ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedId(item.id)}
                    >
                      Delete
                    </Button>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={!!selectedId}
        title="Delete destination?"
        description="This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setSelectedId(null)}
        onConfirm={() => {
          if (selectedId) {
            deleteMutation.mutate(selectedId);
          }
        }}
      />
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "PUBLISHED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-800";

  return (
    <Badge className={styles}>
      {status}
    </Badge>
  );
}
