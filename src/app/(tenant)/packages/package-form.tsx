"use client";

import { useEffect, useState } from "react";
import { createPackage, updatePackage } from "@/lib/packages-api";
import { getDestinations } from "@/lib/destinations-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { TagSelector } from "@/components/ui/tag-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItineraryBuilder } from "@/components/packages/itinerary-builder";
import { StringListBuilder } from "@/components/packages/string-list-builder";
import { formatApiError } from "@/lib/utils";
import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(2, "Package name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  duration: z.string().optional(),
  priceFrom: z.number().min(0, "Price must be zero or greater"),
  overview: z.string().optional(),
  destinationId: z.string().min(1, "Destination is required"),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  itinerary: z.array(z.unknown()).optional(),
  highlights: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  coverImageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function PackageForm({
  initialData,
  isEdit = false,
}: any) {
  const router = useRouter();
  const { push } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: destinations } = useQuery({
    queryKey: ["destinations"],
    queryFn: getDestinations,
  });

  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    duration: "",
    priceFrom: 0,
    overview: "",
    destinationId: "",
    tagIds: [],
    status: "DRAFT",
    itinerary: [],
    highlights: [],
    inclusions: [],
    exclusions: [],
    coverImageUrl: "",
    galleryUrls: [],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        tagIds: initialData.tags?.map((t: any) => t.id),
        itinerary: initialData.itinerary ?? [],
        highlights: initialData.highlights ?? [],
        inclusions: initialData.inclusions ?? [],
        exclusions: initialData.exclusions ?? [],
        coverImageUrl:
          initialData.coverImage?.url ?? "",
        galleryUrls:
          initialData.media?.map(
            (m: any) => m.url
          ) ?? [],
      });
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = packageSchema.safeParse({
        name: form.name,
        slug: form.slug,
        duration: form.duration,
        priceFrom: Number(form.priceFrom || 0),
        overview: form.overview,
        destinationId: form.destinationId,
        tagIds: form.tagIds,
        status: form.status,
        itinerary: form.itinerary,
        highlights: form.highlights,
        inclusions: form.inclusions,
        exclusions: form.exclusions,
        coverImageUrl: form.coverImageUrl,
        galleryUrls: form.galleryUrls,
      });

      if (!parsed.success) {
        throw new Error(
          parsed.error.issues[0]?.message ?? "Invalid package form"
        );
      }

      const payload = {
        name: parsed.data.name,
        duration: parsed.data.duration,
        priceFrom: parsed.data.priceFrom,
        overview: parsed.data.overview,
        destinationId: parsed.data.destinationId,
        tagIds: parsed.data.tagIds,
        status: parsed.data.status,
        itinerary: parsed.data.itinerary,
        highlights: parsed.data.highlights,
        inclusions: parsed.data.inclusions,
        exclusions: parsed.data.exclusions,
        coverImageUrl: parsed.data.coverImageUrl,
        galleryUrls: parsed.data.galleryUrls,
      };

      return isEdit
        ? updatePackage(initialData?.id, payload)
        : createPackage({ ...payload, slug: parsed.data.slug });
    },
    onSuccess: () => {
      push({
        title: isEdit
          ? "Package updated"
          : "Package created",
        description: isEdit
          ? "Package details updated successfully."
          : "Package created successfully.",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });

      router.push("/packages");
    },
    onError: (err: unknown) => {
      push({
        title: "Save failed",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  const isAgent = user?.role === "AGENT";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="max-w-2xl space-y-10 rounded-2xl border bg-white p-8 shadow-sm"
    >
      {/* BASIC INFORMATION */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Basic Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Package Name <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm({
                  ...form,
                  name,
                  slug: slugify(name),
                });
              }}
              placeholder="Goa Honeymoon Package"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg lowercase"
              value={form.slug}
              disabled={isEdit}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value })
              }
              placeholder="goa-honeymoon"
            />
          </div>

          {/* Destination */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">
              Destination <span className="text-red-500">*</span>
            </label>
            <select
              className="h-11 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.destinationId}
              onChange={(e) =>
                setForm({
                  ...form,
                  destinationId: e.target.value,
                })
              }
            >
              <option value="">Select Destination</option>
              {destinations?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Duration
            </label>
            <Input
              className="h-11 rounded-lg"
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration: e.target.value,
                })
              }
              placeholder="5 Days / 4 Nights"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Price From
            </label>
            <Input
              type="number"
              className="h-11 rounded-lg"
              value={form.priceFrom}
              onChange={(e) =>
                setForm({
                  ...form,
                  priceFrom: Number(e.target.value),
                })
              }
              placeholder="24999"
            />
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h3>

        <textarea
          className="min-h-[140px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Write package overview..."
          value={form.overview}
          onChange={(e) =>
            setForm({
              ...form,
              overview: e.target.value,
            })
          }
        />
      </div>

      {/* TAGS */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tags
        </h3>

        <TagSelector
          selected={form.tagIds}
          onChange={(ids) =>
            setForm({ ...form, tagIds: ids })
          }
        />
      </div>

      {/* ITINERARY */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Itinerary
        </h3>

        <ItineraryBuilder
          value={form.itinerary}
          onChange={(days) =>
            setForm({ ...form, itinerary: days })
          }
        />
      </div>

      {/* HIGHLIGHTS & DETAILS */}
      <div className="space-y-8 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Package Details
        </h3>

        <StringListBuilder
          title="Highlights"
          placeholder="e.g. Private beach dinner"
          value={form.highlights}
          onChange={(items) =>
            setForm({ ...form, highlights: items })
          }
        />

        <StringListBuilder
          title="Inclusions"
          placeholder="e.g. Airport transfers"
          value={form.inclusions}
          onChange={(items) =>
            setForm({ ...form, inclusions: items })
          }
        />

        <StringListBuilder
          title="Exclusions"
          placeholder="e.g. Personal expenses"
          value={form.exclusions}
          onChange={(items) =>
            setForm({ ...form, exclusions: items })
          }
        />
      </div>

      {/* STATUS */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Status
        </h3>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant={
              form.status === "DRAFT"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setForm({ ...form, status: "DRAFT" })
            }
          >
            Draft
          </Button>

          <Button
            type="button"
            disabled={isAgent}
            variant={
              form.status === "PUBLISHED"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setForm({
                ...form,
                status: "PUBLISHED",
              })
            }
          >
            Publish
          </Button>
        </div>
      </div>

      {/* MEDIA */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Media
        </h3>

        {/* Cover */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Cover Image URL
          </label>
          <Input
            className="h-11 rounded-lg"
            placeholder="https://..."
            value={form.coverImageUrl}
            onChange={(e) =>
              setForm({
                ...form,
                coverImageUrl: e.target.value,
              })
            }
          />

          {form.coverImageUrl && (
            <img
              src={form.coverImageUrl}
              className="mt-3 h-40 w-full rounded-xl object-cover border"
            />
          )}
        </div>

        {/* Gallery */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Gallery URLs
          </label>
          <Input
            className="h-11 rounded-lg"
            placeholder="https://img1.jpg, https://img2.jpg"
            value={form.galleryUrls?.join(", ") ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                galleryUrls: e.target.value
                  .split(",")
                  .map((u) => u.trim())
                  .filter(Boolean),
              })
            }
          />

          <div className="flex gap-3 mt-4 flex-wrap">
            {form.galleryUrls?.map(
              (url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  className="h-20 w-28 rounded-lg object-cover border"
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end border-t pt-8">
        <Button
          className="rounded-lg px-8"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Update Package"
              : "Create Package"}
        </Button>
      </div>
    </form>

  );
}
