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
      const payload = {
        name: form.name,
        duration: form.duration,
        priceFrom: form.priceFrom,
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
      };

      return isEdit
        ? updatePackage(initialData?.id, payload)
        : createPackage({ ...payload, slug: form.slug });
    },
    onSuccess: () => {
      push({
        title: isEdit
          ? "Package updated"
          : "Package created",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });

      router.push("/packages");
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

  const isAgent = user?.role === "AGENT";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6">

      <Input
        placeholder="Package Name"
        value={form.name}
        onChange={(e) => {
          const name = e.target.value;
          setForm({
            ...form,
            name,
            slug: slugify(name),
          });
        }}
      />

      <Input
        placeholder="Slug"
        value={form.slug}
        disabled={isEdit}
        onChange={(e) =>
          setForm({
            ...form,
            slug: e.target.value,
          })
        }
      />

      <select
        className="border rounded px-3 py-2 w-full"
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

      <Input
        placeholder="Duration (e.g. 5 Days / 4 Nights)"
        value={form.duration}
        onChange={(e) =>
          setForm({
            ...form,
            duration: e.target.value,
          })
        }
      />

      <Input
        type="number"
        placeholder="Price From"
        value={form.priceFrom}
        onChange={(e) =>
          setForm({
            ...form,
            priceFrom: Number(e.target.value),
          })
        }
      />

      <textarea
        className="border rounded px-3 py-2 w-full"
        placeholder="Overview"
        value={form.overview}
        onChange={(e) =>
          setForm({
            ...form,
            overview: e.target.value,
          })
        }
      />

      <TagSelector
        selected={form.tagIds}
        onChange={(ids) =>
          setForm({ ...form, tagIds: ids })
        }
      />

      <ItineraryBuilder
        value={form.itinerary}
        onChange={(days) =>
          setForm({ ...form, itinerary: days })
        }
      />

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

      <div className="flex gap-3">
        <Button
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

      {/* COVER IMAGE */}
      <div>
        <label className="text-sm font-medium">
          Cover Image URL
        </label>

        <Input
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
            className="mt-3 h-40 rounded object-cover"
          />
        )}
      </div>

      {/* GALLERY */}
      <div>
        <label className="text-sm font-medium">
          Gallery URLs (comma separated)
        </label>

        <Input
          placeholder="https://image1.jpg, https://image2.jpg"
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


        <div className="flex gap-2 mt-3 flex-wrap">
          {form.galleryUrls?.map(
            (url: string, i: number) => (
              <img
                key={i}
                src={url}
                className="h-20 rounded object-cover"
              />
            )
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => mutation.mutate()}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
}
