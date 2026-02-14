"use client";

import { useEffect, useState } from "react";
import {
  createDestination,
  updateDestination,
} from "@/lib/destinations-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TagSelector } from "@/components/ui/tag-selector";
import { formatApiError } from "@/lib/utils";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function DestinationForm({
  initialData,
  isEdit = false,
}: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    city: "",
    country: "",
    description: "",
    tagIds: [],
    status: "DRAFT",
    coverImageUrl: "",
    galleryUrls: [],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        tagIds: initialData.tags?.map(
          (t: any) => t.id
        ),
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
      const payload = {
        name: form.name,
        city: form.city,
        country: form.country,
        description: form.description,
        status: form.status,
        tagIds: form.tagIds,
        coverImageUrl: form.coverImageUrl,
        galleryUrls: form.galleryUrls,
      };

      if (isEdit) {
        return updateDestination(
          initialData?.id,
          payload
        );
      }

      return createDestination({ ...payload, slug: form.slug });
    },
    onSuccess: () => {
      push({
        title: isEdit
          ? "Destination updated"
          : "Destination created",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["destinations"],
      });

      router.push("/destinations");
    },
    onError: (err: any) => {
      push({
        title: "Error",
        description: formatApiError(err),
        variant: "error",
      });
    },
  });

  const isAgent =
    user?.role === "AGENT";

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
              Destination Name <span className="text-red-500">*</span>
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
              placeholder="Goa"
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
              placeholder="goa"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              City <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
              placeholder="Goa"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Country <span className="text-red-500">*</span>
            </label>
            <Input
              className="h-11 rounded-lg"
              value={form.country}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value })
              }
              placeholder="India"
            />
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Overview
          </label>

          <textarea
            className="min-h-[140px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe this destination..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* TAGS */}
      <div className="space-y-6 border-t pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tags
        </h3>

        <TagSelector
          selected={form.tagIds || []}
          onChange={(ids) =>
            setForm({ ...form, tagIds: ids })
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
            variant={
              form.status === "PUBLISHED"
                ? "default"
                : "outline"
            }
            disabled={isAgent}
            onClick={() =>
              setForm({
                ...form,
                status: "PUBLISHED",
              })
            }
          >
            Publish
          </Button>

          {isAgent && (
            <Badge variant="secondary">
              Agents cannot publish
            </Badge>
          )}
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
      <div className="flex justify-end gap-3 border-t pt-8">
        <Button
          type="submit"
          className="rounded-lg px-8"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Update Destination"
              : "Create Destination"}
        </Button>
      </div>
    </form>

  );
}
