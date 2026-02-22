"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPackages, deletePackage } from "@/lib/packages-api";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatApiError } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PackagesTable() {
  const router = useRouter();
  const { user } = useAuth();
  const { push } = useToast();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: (_, id) => {
      push({
        title: "Package deleted",
        description: "The package was removed successfully.",
        variant: "success",
      });

      queryClient.setQueryData(["packages"], (old: any[]) =>
        old?.filter((p) => p.id !== id)
      );

      setSelectedId(null);
    },
    onError: (err: unknown) => {
      push({
        title: "Delete failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

   if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        Loading packages...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border p-6 shadow-sm text-muted-foreground">
        No packages created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <Table className="text-sm">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="p-3 text-left font-semibold">Name</TableHead>
            <TableHead className="p-3 text-left font-semibold">Destination</TableHead>
            <TableHead className="p-3 text-left font-semibold">Price</TableHead>
            <TableHead className="p-3 text-left font-semibold">Status</TableHead>
            <TableHead className="p-4 text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((pkg: any) => (
            <TableRow key={pkg.id} className="border-t">
              <TableCell className="p-3 font-medium">{pkg.name}</TableCell>
              <TableCell className="p-3">{pkg.destination?.name}</TableCell>
              <TableCell className="p-3">₹{pkg.priceFrom}</TableCell>
              <TableCell className="p-3">
                <Badge
                  className={
                    pkg.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {pkg.status}
                </Badge>
              </TableCell>
              <TableCell className="p-3 text-right">
                <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(`/packages/${pkg.id}`)
                  }
                >
                  Edit
                </Button>

                {user?.role === "TENANT_ADMIN" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedId(pkg.id)}
                  >
                    Delete
                  </Button>
                )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmModal
        open={!!selectedId}
        title="Delete package?"
        description="This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setSelectedId(null)}
        onConfirm={() =>
          selectedId && deleteMutation.mutate(selectedId)
        }
      />
    </div>
  );
}
