"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, updatePlan } from "@/lib/plans-api";
import { useToast } from "@/components/ui/toast";
import { formatApiError } from "@/lib/utils";
import { Plan } from "@/types/api";

type PlanFormValues = {
  name: string;
  code: string;
  isActive: boolean;
  limits: {
    maxAgents: number;
    maxDestinations: number;
    maxPackages: number;
    mediaEnabled: boolean;
  };
};

const planSchema = z.object({
  name: z.string().min(2, "Plan name is required"),
  code: z.string().min(2, "Plan code is required"),
  isActive: z.boolean(),
  limits: z.object({
    maxAgents: z.number().min(0, "Must be 0 or more"),
    maxDestinations: z.number().min(0, "Must be 0 or more"),
    maxPackages: z.number().min(0, "Must be 0 or more"),
    mediaEnabled: z.boolean(),
  }),
});

export function PlanForm({
  initialData,
}: {
  initialData?: Plan;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { push } = useToast();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    mode: "onBlur",
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
        description: initialData
          ? "Plan details were updated successfully."
          : "Plan was created successfully.",
      });
      router.push("/plans");
    } catch (err: unknown) {
      push({
        variant: "error",
        title: "Save failed",
        description: formatApiError(err),
      });
    }
  };

  const onInvalid = () => {
    const errors = form.formState.errors;
    const message =
      errors.name?.message ||
      errors.code?.message ||
      errors.limits?.maxAgents?.message ||
      errors.limits?.maxDestinations?.message ||
      errors.limits?.maxPackages?.message ||
      "Please fix the highlighted form errors.";

    push({
      variant: "error",
      title: "Validation failed",
      description: String(message),
    });
  };

  const limitFields: Array<{
    label: string;
    field:
      | "limits.maxAgents"
      | "limits.maxDestinations"
      | "limits.maxPackages";
    description: string;
  }> = [
    {
      label: "Max Agents",
      field: "limits.maxAgents",
      description: "Number of agent accounts allowed",
    },
    {
      label: "Max Destinations",
      field: "limits.maxDestinations",
      description: "Total destinations allowed",
    },
    {
      label: "Max Packages",
      field: "limits.maxPackages",
      description: "Total packages allowed",
    },
  ];

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      className="max-w-2xl rounded-2xl border bg-white p-10 shadow-sm space-y-8"
    >
      {/* BASIC INFO */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <Input
            className="h-11 rounded-lg"
            {...form.register("name", { required: true })}
            placeholder="Starter Plan"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Plan Code <span className="text-red-500">*</span>
          </label>
          <Input
            className="h-11 rounded-lg uppercase tracking-wide"
            {...form.register("code", { required: true })}
            placeholder="STARTER"
            disabled={!!initialData}
          />
          <p className="text-xs text-muted-foreground">
            Unique identifier (cannot be changed later)
          </p>
        </div>
      </div>

      {/* USAGE LIMITS */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Usage Limits
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {limitFields.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border bg-muted/20 p-5 space-y-3 transition hover:bg-muted/40"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {item.label} <span className="text-red-500">*</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              </div>

              <Input
                type="number"
                className="h-10 rounded-lg"
                {...form.register(item.field, {
                  valueAsNumber: true,
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Features
        </h3>

        <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-6 transition hover:bg-muted/40">
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Media Upload Support
            </div>
            <div className="text-xs text-muted-foreground">
              Allow tenants to upload cover images & galleries
            </div>
          </div>

          <Switch
            checked={form.watch("limits.mediaEnabled")}
            onCheckedChange={(value) =>
              form.setValue("limits.mediaEnabled", value)
            }
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-8">
        <Button
          type="button"
          variant="outline"
          className="rounded-lg px-6"
          onClick={() => router.push("/plans")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-lg px-8"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </form>


  );
}
