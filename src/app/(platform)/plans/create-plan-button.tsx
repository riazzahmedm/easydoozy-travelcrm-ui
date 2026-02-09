"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function CreatePlanButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <Button
      onClick={() => {
        setIsNavigating(true);
        router.push("/plans/new");
      }}
      disabled={isNavigating}
    >
      {isNavigating ? (
        <>
          <Spinner className="text-white" size={14} />
          Loading...
        </>
      ) : (
        "Create Plan"
      )}
    </Button>
  );
}
