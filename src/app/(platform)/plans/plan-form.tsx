"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, updatePlan } from "@/lib/plans-api";
import { useToast } from "@/components/ui/toast";

type PlanFormValues = {
  name: string;
  code?: string;
  isActive: boolean;
  limits: {
    maxAgents: number;
    maxDestinations: number;
    maxPackages: number;
    mediaEnabled: boolean;
  };
};

export function PlanForm({
  initialData,
}: {
  initialData?: any;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const form = useForm<PlanFormValues>({
    defaultValues: initialData ?? {
      name: "",
      code: "",
      isActive: true,
      limits: {
        maxAgents: 1,
        maxDestinations: 5,
        maxPackages: 10,
        mediaEnabled: true,
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (values: PlanFormValues) =>
      initialData
        ? updatePlan(initialData.id, {
            name: values.name,
            limits: values.limits,
            isActive: values.isActive,
          })
        : createPlan(values),
  });

  const onSubmit = async (values: PlanFormValues) => {
    try {
      await mutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["plans"] });
      push({
        variant: "success",
        title: initialData ? "Plan updated" : "Plan created",
      });
      router.push("/plans");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Something went wrong";
      push({
        variant: "error",
        title: "Save failed",
        description: message,
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded border max-w-xl"
    >
      {/* Name */}
      <div>
        <label className="text-sm font-medium">Plan Name</label>
        <Input {...form.register("name", { required: true })} />
      </div>

      {/* Code (create only) */}
      {!initialData && (
        <div>
          <label className="text-sm font-medium">Plan Code</label>
          <Input
            {...form.register("code", { required: true })}
            placeholder="STARTER"
          />
        </div>
      )}

      {/* Limits */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Max Agents</label>
          <Input
            type="number"
            {...form.register("limits.maxAgents", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <label className="text-sm">Max Destinations</label>
          <Input
            type="number"
            {...form.register("limits.maxDestinations", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <label className="text-sm">Max Packages</label>
          <Input
            type="number"
            {...form.register("limits.maxPackages", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>

      {/* Media Toggle */}
      <div className="flex items-center justify-between border rounded p-4">
        <div>
          <div className="font-medium text-sm">
            Media Enabled
          </div>
          <div className="text-xs text-muted-foreground">
            Allow image uploads
          </div>
        </div>
        <Switch
          checked={form.watch("limits.mediaEnabled")}
          onCheckedChange={(value) =>
            form.setValue("limits.mediaEnabled", value)
          }
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/plans")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </form>
  );
}
