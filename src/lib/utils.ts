import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatApiError(err: any) {
  const message = err?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.map((m: string) => `• ${m}`).join("\n");
  }

  if (typeof message === "string") {
    return message;
  }

  return "Something went wrong";
}
