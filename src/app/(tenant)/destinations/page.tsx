import { DestinationsTable } from "./destinations-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DestinationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Destinations
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage travel destinations
          </p>
        </div>

        <Button asChild>
          <Link href="/destinations/new">Add Destination</Link>
        </Button>
      </div>

      <DestinationsTable />
    </div>
  );
}
