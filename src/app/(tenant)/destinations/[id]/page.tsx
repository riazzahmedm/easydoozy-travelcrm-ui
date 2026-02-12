import { getServerDestinationById } from "@/lib/server-destinations-api";
import { redirect } from "next/navigation";
import { DestinationForm } from "../destination-form";

export default async function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {

   const { id } = await params;

  const destination =
    await getServerDestinationById(id);

  if (!destination) {
    redirect("/destinations");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Edit Destination
      </h1>

      <DestinationForm
        initialData={destination}
        isEdit
      />
    </div>
  );
}
