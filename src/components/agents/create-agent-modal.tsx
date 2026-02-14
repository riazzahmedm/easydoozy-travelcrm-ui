"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgent } from "@/lib/agents-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatApiError } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateAgentModal({
  open,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const { push } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      push({
        title: "Agent created successfully",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });

      onClose();
      setForm({ name: "", email: "", password: "" });
    },
    onError: (err: any) => {
      push({
        title: "Error",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-2xl space-y-8">

        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Create Agent
          </h2>
          <p className="text-sm text-muted-foreground">
            Add a new agent to this tenant.
          </p>
        </div>

        {/* FORM FIELDS */}
        <div className="space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Agent Name <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            variant="outline"
            className="rounded-lg px-6"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="rounded-lg px-8"
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating..."
              : "Create Agent"}
          </Button>
        </div>

      </div>
    </div>
  );
}
