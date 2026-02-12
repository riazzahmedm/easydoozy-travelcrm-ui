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
    <div className="flex gap-2">
      <Input
        placeholder="Tag name (e.g. Honeymoon)"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <Button
        disabled={!name || mutation.isPending}
        onClick={() =>
          mutation.mutate({
            name,
            slug: slugify(name),
          })
        }
      >
        Add
      </Button>
    </div>
  );
}
