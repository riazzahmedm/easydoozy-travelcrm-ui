"use client";

import { useState } from "react";
import { createTag } from "@/lib/tags-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { formatApiError } from "@/lib/utils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function TagForm() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { push } = useToast();

  const tagSchema = z.object({
    name: z.string().min(2, "Tag name must be at least 2 characters"),
  });

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      push({
        title: "Tag created",
        description: "The tag was created successfully.",
        variant: "success",
      });
      setName("");
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
    onError: (err: unknown) => {
      push({
        title: "Failed to create tag",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Tag Name <span className="text-red-500">*</span>
    </label>

    <div className="flex gap-3">
      <Input
        className="h-11 rounded-lg"
        placeholder="e.g. Honeymoon"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <Button
        className="h-11 rounded-lg px-6"
        disabled={!name || mutation.isPending}
        onClick={() => {
          const parsed = tagSchema.safeParse({ name });
          if (!parsed.success) {
            push({
              title: "Validation failed",
              description: parsed.error.issues[0]?.message ?? "Invalid input",
              variant: "error",
            });
            return;
          }
          mutation.mutate({
            name: parsed.data.name,
            slug: slugify(parsed.data.name),
          });
        }}
      >
        {mutation.isPending ? "Adding..." : "Add Tag"}
      </Button>
    </div>
  </div>

  <p className="text-xs text-muted-foreground">
    Slug will be generated automatically.
  </p>
</div>

  );
}
