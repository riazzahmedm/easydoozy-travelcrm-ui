"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  title: string;
  placeholder?: string;
  value: string[];
  onChange: (items: string[]) => void;
}

export function StringListBuilder({
  title,
  placeholder,
  value,
  onChange,
}: Props) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;

    onChange([...value, input.trim()]);
    setInput("");
  };

  const removeItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateItem = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Add input */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
        >
          Add
        </Button>
      </div>

      {/* Items */}
      {value.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No items added.
        </div>
      )}

      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2"
          >
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              value={item}
              onChange={(e) =>
                updateItem(index, e.target.value)
              }
            />

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeItem(index)}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
