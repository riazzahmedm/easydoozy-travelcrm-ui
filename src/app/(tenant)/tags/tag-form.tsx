"use client";

import { useState } from "react";
import { createTag } from "@/lib/tags-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      push({
        title: "Tag created",
        variant: "success",
      });
      setName("");
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
    onError: () => {
      push({
        title: "Failed to create tag",
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
        onClick={() =>
          mutation.mutate({
            name,
            slug: slugify(name),
          })
        }
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
