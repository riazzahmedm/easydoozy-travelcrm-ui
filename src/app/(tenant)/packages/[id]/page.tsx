import { getServerPackageById } from "@/lib/server-packages-api";
import { redirect } from "next/navigation";
import { PackageForm } from "../package-form";

interface Props {
  params: { id: string };
}

export default async function EditPackagePage({
  params,
}: Props) {
  const { id } = await params;
  const pkg = await getServerPackageById(id);

  if (!pkg) {
    redirect("/packages");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Edit Package
      </h1>
      <PackageForm
        initialData={pkg}
        isEdit
      />
    </div>
  );
}
