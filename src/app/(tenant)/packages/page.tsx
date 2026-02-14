import { PackagesTable } from "./packages-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

        <Button asChild>
          <Link href="/packages/new">Add Package</Link>
        </Button>
      </div>

      <PackagesTable />
    </div>
  );
}
