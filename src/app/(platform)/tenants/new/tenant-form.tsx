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
  });

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // 1️⃣ Create tenant + admin
      const result = await createTenant({
        tenantName: form.tenantName,
        slug: form.slug,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      });

      // 2️⃣ Assign subscription
      if (form.planId) {
        await assignSubscription({
          tenantId: result.tenant.id,
          planId: form.planId,
        });
      }

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
    onError: () => {
      push({
        title: "Creation failed",
        description: "Could not create tenant",
        variant: "error",
      });
    },
  });

  return (
    <div className="bg-white rounded border p-6 space-y-6">
      {/* Tenant Info */}
      <div className="space-y-4">
        <h3 className="font-medium">Tenant Info</h3>

        <Input
          placeholder="Tenant Name"
          value={form.tenantName}
          onChange={(e) =>
            setForm({ ...form, tenantName: e.target.value })
          }
        />

        <Input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />
      </div>

      {/* Admin Info */}
      <div className="space-y-4">
        <h3 className="font-medium">Admin Info</h3>

        <Input
          placeholder="Admin Name"
          value={form.adminName}
          onChange={(e) =>
            setForm({ ...form, adminName: e.target.value })
          }
        />

        <Input
          placeholder="Admin Email"
          value={form.adminEmail}
          onChange={(e) =>
            setForm({ ...form, adminEmail: e.target.value })
          }
        />

        <Input
          type="password"
          placeholder="Admin Password"
          value={form.adminPassword}
          onChange={(e) =>
            setForm({
              ...form,
              adminPassword: e.target.value,
            })
          }
        />
      </div>

      {/* Plan Selection */}
      <div className="space-y-4">
        <h3 className="font-medium">Subscription</h3>

        <select
          className="border rounded px-3 py-2 w-full text-sm"
          value={form.planId}
          onChange={(e) =>
            setForm({ ...form, planId: e.target.value })
          }
        >
          <option value="">Select Plan</option>
          {plans?.map((plan: any) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending
            ? "Creating..."
            : "Create Tenant"}
        </Button>
      </div>
    </div>
  );
}
