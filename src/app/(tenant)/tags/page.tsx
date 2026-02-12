import { TagsTable } from "./tags-table";

export default function TagsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">
          Tags
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage tags for destinations & packages
        </p>
      </div>

      <TagsTable />
    </div>
  );
}
