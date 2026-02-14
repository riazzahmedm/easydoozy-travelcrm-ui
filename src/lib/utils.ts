import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApiError(err: unknown) {
  if (err instanceof Error && err.message) {
    return err.message;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }

  const message =
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: { data?: { message?: unknown } } })
      .response === "object"
      ? (err as { response?: { data?: { message?: unknown } } })
          .response?.data?.message
      : undefined;

  if (Array.isArray(message)) {
    return message.map((m: string) => `• ${m}`).join("\n");
  }

  if (typeof message === "string") {
    return message;
  }

  return "Something went wrong";
}
