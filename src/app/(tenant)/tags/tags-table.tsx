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
   <div className="max-w-2xl space-y-10 rounded-2xl border bg-white p-8 shadow-sm">

  {/* CREATE TAG */}
  <div className="space-y-6">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      Create Tag
    </h3>

    <TagForm />
  </div>

  {/* TAG LIST */}
  <div className="space-y-6 border-t pt-8">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      Existing Tags
    </h3>

    {data?.length === 0 && (
      <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
        No tags created yet.
      </div>
    )}

    <div className="space-y-3">
      {data?.map((tag: any) => (
        <div
          key={tag.id}
          className="group flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3 transition hover:bg-muted/40"
        >
          <div>
            <div className="text-sm font-medium">
              {tag.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {tag.slug}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition"
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
</div>

  );
}
