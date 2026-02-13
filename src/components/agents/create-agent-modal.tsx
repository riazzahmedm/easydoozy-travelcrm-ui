"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgent } from "@/lib/agents-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        title:
          err?.response?.data?.message ||
          "Failed to create agent",
        variant: "error",
      });
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">
          Create Agent
        </h2>

        <Input
          placeholder="Agent Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={() =>
              mutation.mutate(form)
            }
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
