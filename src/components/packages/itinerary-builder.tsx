"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DayItem {
  dayNumber: number;
  title: string;
  description: string;
}

interface Props {
  value: DayItem[];
  onChange: (days: DayItem[]) => void;
}

export function ItineraryBuilder({ value, onChange }: Props) {
  const addDay = () => {
    const nextDay = value.length + 1;

    onChange([
      ...value,
      {
        dayNumber: nextDay,
        title: "",
        description: "",
      },
    ]);
  };

  const updateDay = (
    index: number,
    field: keyof DayItem,
    newValue: string
  ) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [field]: newValue,
    };

    onChange(updated);
  };

  const removeDay = (index: number) => {
    const updated = value
      .filter((_, i) => i !== index)
      .map((day, idx) => ({
        ...day,
        dayNumber: idx + 1,
      }));

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Itinerary
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={addDay}
        >
          + Add Day
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No days added yet.
        </div>
      )}

      {value.map((day, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 space-y-3 bg-muted/30"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Day {day.dayNumber}
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeDay(index)}
            >
              Remove
            </Button>
          </div>

          <Input
            placeholder="Day title (e.g. Arrival in Bali)"
            value={day.title}
            onChange={(e) =>
              updateDay(index, "title", e.target.value)
            }
          />

          <textarea
            className="border rounded px-3 py-2 w-full text-sm"
            rows={3}
            placeholder="Day description..."
            value={day.description}
            onChange={(e) =>
              updateDay(
                index,
                "description",
                e.target.value
              )
            }
          />
        </div>
      ))}
    </div>
  );
}
