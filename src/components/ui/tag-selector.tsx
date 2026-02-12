"use client";

import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/lib/tags-api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TagSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {data?.map((tag: any) => {
        const active = selected.includes(tag.id);

        return (
          <Badge
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-150 border",
              active
                ? "bg-primary text-white border-primary shadow"
                : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
            )}
          >
            {tag.name}
          </Badge>
        );
      })}
    </div>
  );
}
