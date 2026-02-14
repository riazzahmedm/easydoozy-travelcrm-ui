"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPlans } from "@/lib/plans-api";
import { createTenant } from "@/lib/tenants-api";
import { assignSubscription } from "@/lib/subscriptions-api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plan } from "@/types/api";
import Image from "next/image";
import { z } from "zod";
import { formatApiError } from "@/lib/utils";

export function CreateTenantForm() {
  const router = useRouter();
  const { push } = useToast();

  const [form, setForm] = useState({
    tenantName: "",
    slug: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    planId: "",
    logo: "",
    color: ""
  });

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const tenantSchema = z.object({
    tenantName: z.string().min(2, "Tenant name is required"),
    slug: z
      .string()
      .min(2, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    adminName: z.string().min(2, "Admin name is required"),
    adminEmail: z.string().email("Enter a valid admin email"),
    adminPassword: z.string().min(6, "Admin password must be at least 6 characters"),
    planId: z.string().min(1, "Please select a plan"),
    logo: z.string().optional(),
    color: z.string().optional(),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = tenantSchema.safeParse(form);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid form data");
      }

      // 1️⃣ Create tenant + admin
      const result = await createTenant({
        tenantName: parsed.data.tenantName,
        slug: parsed.data.slug,
        adminName: parsed.data.adminName,
        adminEmail: parsed.data.adminEmail,
        adminPassword: parsed.data.adminPassword,
        logo: parsed.data.logo,
        color: parsed.data.color,
      });

      // 2️⃣ Assign subscription
      await assignSubscription({
        tenantId: result.tenant.id,
        planId: parsed.data.planId,
      });

      return result;
    },
    onSuccess: () => {
      push({
        title: "Tenant created",
        description: "New tenant created successfully",
        variant: "success",
      });

      router.push("/tenants");
      router.refresh();
    },
    onError: (err: unknown) => {
      push({
        title: "Creation failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <div className="max-w-2xl rounded-2xl border bg-white p-10 shadow-sm space-y-8">

      {/* TENANT INFO */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tenant Information
        </h3>

        <div className="grid gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tenant Name <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              placeholder="Tiger Holidays"
              value={form.tenantName}
              onChange={(e) =>
                setForm({ ...form, tenantName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg lowercase"
              placeholder="tiger-holidays"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Used for tenant URL & identification.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="https://cdn.site.com/logo.png"
              value={form.logo}
              onChange={(e) =>
                setForm({ ...form, logo: e.target.value })
              }
            />
            {form.logo && (
              <Image
                src={form.logo}
                alt="Tenant logo preview"
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 mt-2 rounded border p-2 object-contain bg-white"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Color</label>
            <Input
              className="h-11 rounded-lg"
              placeholder="#0f172a"
              value={form.color}
              onChange={(e) =>
                setForm({ ...form, color: e.target.value })
              }
            />
            {form.color && (
              <div
                className="h-10 w-10 rounded-lg border mt-2"
                style={{ background: form.color }}
              />
            )}
          </div>

        </div>
      </div>

      {/* ADMIN INFO */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Admin Account
        </h3>

        <div className="grid gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Admin Name <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              placeholder="John Doe"
              value={form.adminName}
              onChange={(e) =>
                setForm({ ...form, adminName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              type="email"
              placeholder="admin@tigerholidays.com"
              value={form.adminEmail}
              onChange={(e) =>
                setForm({ ...form, adminEmail: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Admin Password <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              type="password"
              placeholder="••••••••"
              value={form.adminPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  adminPassword: e.target.value,
                })
              }
            />
          </div>

        </div>
      </div>

      {/* PLAN SELECTION */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Subscription Plan
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select Plan <span className="text-red-500">*</span>
          </label>

          <div className="rounded-xl border bg-muted/40 p-5">
            <select
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.planId}
              onChange={(e) =>
                setForm({ ...form, planId: e.target.value })
              }
            >
              <option value="">Select Plan</option>
              {plans?.map((plan: Plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-muted-foreground">
              You can change this later from tenant settings.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-8">
        <Button
          variant="outline"
          className="rounded-lg px-6"
          onClick={() => router.push("/tenants")}
        >
          Cancel
        </Button>

        <Button
          disabled={mutation.isPending}
          className="rounded-lg px-8"
          onClick={() => {
            const parsed = tenantSchema.safeParse(form);
            if (!parsed.success) {
              push({
                title: "Validation failed",
                description:
                  parsed.error.issues[0]?.message ??
                  "Please fix the highlighted form errors.",
                variant: "error",
              });
              return;
            }
            mutation.mutate();
          }}
        >
          {mutation.isPending ? "Creating..." : "Create Tenant"}
        </Button>
      </div>
    </div>


  );
}
