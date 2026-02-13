import { PackageForm } from "../package-form";

export default function NewPackagePage() {
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Add Package
      </h1>

      <PackageForm />
    </div>
  );
}
