import { DestinationsTable } from "./destinations-table";

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

        <a
          href="/destinations/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
        >
          Add Destination
        </a>
      </div>

      <DestinationsTable />
    </div>
  );
}
