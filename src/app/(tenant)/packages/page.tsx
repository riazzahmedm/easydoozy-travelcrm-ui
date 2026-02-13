import { PackagesTable } from "./packages-table";

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Packages
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage travel packages
          </p>
        </div>

        <a
          href="/packages/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm"
        >
          Add Package
        </a>
      </div>

      <PackagesTable />
    </div>
  );
}
