"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLead, updateLead } from "@/lib/leads-api";
import { getAgents } from "@/lib/agents-api";
import { getDestinations } from "@/lib/destinations-api";
import { getPackages } from "@/lib/packages-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  mode: "create" | "edit";
  initialData?: any;
}

export function LeadForm({ mode, initialData }: Props) {
  const router = useRouter();
  const { push } = useToast();
  const queryClient = useQueryClient();

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });

  const { data: destinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: 1,
    budget: "",
    source: "WEBSITE",
    notes: "",
    status: "NEW",
    assignedToId: "",
    destinationId: "",
    packageId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        travelDate: initialData.travelDate
          ? initialData.travelDate.split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        travelDate: form.travelDate
          ? new Date(form.travelDate)
          : null,
      };

      return mode === "edit"
        ? updateLead(initialData.id, payload)
        : createLead(payload);
    },
    onSuccess: () => {
      push({
        title:
          mode === "edit"
            ? "Lead updated"
            : "Lead created",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });

      router.push("/leads");
    },
    onError: (err: any) => {
      push({
        title:
          err?.response?.data?.message ||
          "Something went wrong",
        variant: "error",
      });
    },
  });

  return (
    <div className="max-w-3xl rounded-2xl border bg-white p-8 shadow-sm space-y-10">

      {/* BASIC INFO */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Lead Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Full Name *
            </label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phone
            </label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Travel Date
            </label>
            <Input
              type="date"
              value={form.travelDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  travelDate: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Travelers
            </label>
            <Input
              type="number"
              value={form.travelers}
              onChange={(e) =>
                setForm({
                  ...form,
                  travelers: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Budget
            </label>
            <Input
              value={form.budget}
              onChange={(e) =>
                setForm({
                  ...form,
                  budget: e.target.value,
                })
              }
            />
          </div>

        </div>
      </div>

      {/* ASSIGNMENT */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Assignment & Source
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assign To
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.assignedToId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignedToId: e.target.value,
                })
              }
            >
              <option value="">Unassigned</option>
              {agents?.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Source
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.source}
              onChange={(e) =>
                setForm({
                  ...form,
                  source: e.target.value,
                })
              }
            >
              <option value="WEBSITE">Website</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="CALL">Call</option>
              <option value="REFERRAL">Referral</option>
              <option value="MANUAL">Manual Entry</option>
            </select>
          </div>

        </div>
      </div>

      {/* LINKED INFO */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Related Travel Info
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Destination
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.destinationId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  destinationId: e.target.value,
                })
              }
            >
              <option value="">None</option>
              {destinations?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Package
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.packageId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  packageId: e.target.value,
                })
              }
            >
              <option value="">None</option>
              {packages?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* NOTES */}
      <div className="space-y-2 border-t pt-8">
        <label className="text-sm font-medium">
          Notes
        </label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 text-sm min-h-[120px]"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/leads")}
        >
          Cancel
        </Button>

        <Button
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending
            ? "Saving..."
            : mode === "edit"
              ? "Update Lead"
              : "Create Lead"}
        </Button>
      </div>
    </div>
  );
}
