"use client";

import { useState } from "react";
import { AgentsTable } from "@/components/agents/agents-table";
import { CreateAgentModal } from "@/components/agents/create-agent-modal";

export default function AgentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Agents
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your travel agents
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
        >
          Add Agent
        </button>
      </div>

      <AgentsTable />

      <CreateAgentModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
