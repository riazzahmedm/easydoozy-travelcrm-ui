import { DestinationForm } from "../destination-form";

export default function NewDestinationPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">
        Add Destination
      </h1>

      <DestinationForm />
    </div>
  );
}
