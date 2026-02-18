"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLead,
  LeadPayload,
  searchLeadsByPhone,
  updateLead,
} from "@/lib/leads-api";
import { getAgents } from "@/lib/agents-api";
import { getDestinations } from "@/lib/destinations-api";
import { getPackages } from "@/lib/packages-api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatApiError } from "@/lib/utils";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

type LeadDetails = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  travelDate?: string | null;
  travelers?: number | null;
  budget?: number | null;
  source?: string | null;
  notes?: string | null;
  status?: LeadStatus | null;
  assignedToId?: string | null;
  destinationId?: string | null;
  packageId?: string | null;
};

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  travelers: number;
  budget: string;
  source: string;
  notes: string;
  status: LeadStatus;
  assignedToId: string;
  destinationId: string;
  packageId: string;
};

type OptionItem = {
  id: string;
  name: string;
};

type LeadPhoneMatch = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

interface Props {
  mode: "create" | "edit";
  initialData?: LeadDetails;
}

function getInitialForm(initialData?: LeadDetails): LeadFormState {
  if (!initialData) {
    return {
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
    };
  }

  return {
    name: initialData.name ?? "",
    email: initialData.email ?? "",
    phone: initialData.phone ?? "",
    travelDate: initialData.travelDate
      ? initialData.travelDate.split("T")[0]
      : "",
    travelers: initialData.travelers ?? 1,
    budget:
      typeof initialData.budget === "number"
        ? String(initialData.budget)
        : "",
    source: initialData.source ?? "WEBSITE",
    notes: initialData.notes ?? "",
    status: initialData.status ?? "NEW",
    assignedToId: initialData.assignedToId ?? "",
    destinationId: initialData.destinationId ?? "",
    packageId: initialData.packageId ?? "",
  };
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

  const [form, setForm] = useState<LeadFormState>(
    getInitialForm(initialData)
  );

  const { data: phoneMatches } = useQuery({
    queryKey: ["lead-phone-search", form.phone],
    queryFn: () => searchLeadsByPhone(form.phone),
    enabled: form.phone.trim().length >= 3,
  });

  const applyMatchedLead = (lead: LeadPhoneMatch) => {
    setForm((prev) => ({
      ...prev,
      name: prev.name || lead.name || "",
      email: prev.email || lead.email || "",
      phone: lead.phone || prev.phone,
    }));
  };

  const exactMatch = (phoneMatches as LeadPhoneMatch[] | undefined)?.find(
    (lead) => (lead.phone ?? "").trim() === form.phone.trim()
  );

  const mutation = useMutation({
    mutationFn: () => {
      const name = form.name.trim();
      const phone = form.phone.trim();
      const travelDate = form.travelDate;
      const budget = Number(form.budget);
      const assignedToId = form.assignedToId;

      if (!name) {
        throw new Error("Full Name is required");
      }
      if (!phone) {
        throw new Error("Phone is required");
      }
      if (!travelDate) {
        throw new Error("Travel Date is required");
      }
      if (!form.budget || Number.isNaN(budget)) {
        throw new Error("Budget is required");
      }
      if (!assignedToId) {
        throw new Error("Assign To is required");
      }

      const payload: LeadPayload = {
        name,
        email: form.email.trim() || undefined,
        phone,
        travelDate,
        travelers: Number.isFinite(form.travelers)
          ? form.travelers
          : undefined,
        budget,
        source: form.source || undefined,
        notes: form.notes.trim() || undefined,
        status: form.status,
        assignedToId,
        destinationId: form.destinationId || undefined,
        packageId: form.packageId || undefined,
      };

      return mode === "edit"
        ? updateLead(initialData!.id, payload)
        : createLead(payload);
    },
    onSuccess: () => {
      push({
        title: mode === "edit" ? "Lead updated" : "Lead created",
        description:
          mode === "edit"
            ? "Lead details updated successfully."
            : "Lead created successfully.",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });

      router.push("/leads");
    },
    onError: (err: unknown) => {
      push({
        title: "Save failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  return (
    <div className="max-w-3xl rounded-2xl border bg-white p-8 shadow-sm space-y-10">
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Lead Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={() => {
                if (exactMatch && (!form.name || !form.email)) {
                  applyMatchedLead(exactMatch);
                }
              }}
            />
            {!!(phoneMatches as LeadPhoneMatch[] | undefined)?.length && (
              <div className="rounded-md border bg-muted/20 p-2 space-y-2">
                <div className="text-xs text-muted-foreground">
                  Matching leads in this tenant:
                </div>
                {(phoneMatches as LeadPhoneMatch[]).map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    className="w-full rounded-md border bg-white px-3 py-2 text-left text-xs hover:bg-muted/40"
                    onClick={() => applyMatchedLead(lead)}
                  >
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-muted-foreground">
                      {lead.phone} {lead.email ? `• ${lead.email}` : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Travel Date <span className="text-red-500">*</span></label>
            <Input
              required
              type="date"
              value={form.travelDate}
              onChange={(e) =>
                setForm({ ...form, travelDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Travelers</label>
            <Input
              type="number"
              value={form.travelers}
              onChange={(e) =>
                setForm({ ...form, travelers: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Budget <span className="text-red-500">*</span></label>
            <Input
              required
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Assignment & Source
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Assign To <span className="text-red-500">*</span></label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.assignedToId}
              onChange={(e) =>
                setForm({ ...form, assignedToId: e.target.value })
              }
            >
              <option value="">Select agent</option>
              {agents?.map((a: OptionItem) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Source</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
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

      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Related Travel Info
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.destinationId}
              onChange={(e) =>
                setForm({ ...form, destinationId: e.target.value })
              }
            >
              <option value="">None</option>
              {destinations?.map((d: OptionItem) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Package</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.packageId}
              onChange={(e) =>
                setForm({ ...form, packageId: e.target.value })
              }
            >
              <option value="">None</option>
              {packages?.map((p: OptionItem) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2 border-t pt-8">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 text-sm min-h-[120px]"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-8">
        <Button variant="outline" onClick={() => router.push("/leads")}>
          Cancel
        </Button>

        <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
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
