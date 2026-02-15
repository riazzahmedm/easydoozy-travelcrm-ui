"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadsTable } from "./leads-table";
import Link from "next/link";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer inquiries
          </p>
        </div>

        <Button asChild>
          <Link href="/leads/new">Add Lead</Link>
        </Button>
      </div>

      <LeadsTable />
    </div>
  );
}
