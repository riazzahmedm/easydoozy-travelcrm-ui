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
        title:
          err?.response?.data?.message ||
          "Something went wrong",
        variant: "error",
      });
    },
  });

  const isAgent =
    user?.role === "AGENT";

  return (
    <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Destination Name"
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

        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
        />

        <Input
          placeholder="Country"
          value={form.country}
          onChange={(e) =>
            setForm({
              ...form,
              country: e.target.value,
            })
          }
        />
      </div>

      {/* DESCRIPTION */}
      <textarea
        className="border rounded px-3 py-2 w-full text-sm min-h-[120px]"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      {/* TAGS */}
      <div>
        <label className="text-sm font-medium">
          Tags
        </label>

        <TagSelector
          selected={form.tagIds || []}
          onChange={(ids) =>
            setForm({
              ...form,
              tagIds: ids,
            })
          }
        />
      </div>

      {/* STATUS */}
      <div>
        <label className="text-sm font-medium">
          Status
        </label>

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            variant={
              form.status === "DRAFT"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setForm({
                ...form,
                status: "DRAFT",
              })
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

      {/* ACTIONS */}
      <div className="flex justify-end">
        <Button
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending
            ? "Saving..."
            : isEdit
              ? "Update Destination"
              : "Create Destination"}
        </Button>
      </div>
    </div>
  );
}
