"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, deleteTag } from "@/lib/tags-api";
import { useToast } from "@/components/ui/toast";
import { TagForm } from "./tag-form";
import { Button } from "@/components/ui/button";

export function TagsTable() {
  const queryClient = useQueryClient();
  const { push } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      push({
        title: "Tag deleted",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="bg-white border rounded p-6 space-y-6">
      <TagForm />

      <div className="border-t pt-4 space-y-2">
        {data?.map((tag: any) => (
          <div
            key={tag.id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <div>
              <div className="font-medium">
                {tag.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {tag.slug}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                deleteMutation.mutate(tag.id)
              }
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
