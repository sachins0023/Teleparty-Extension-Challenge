"use client";

import { toast } from "sonner";

export function toastMessage({
  message,
  type = "success",
  action,
  persist = false,
}: {
  message: string;
  type: "success" | "error";
  action?: { label: string; onClick: () => void };
  persist?: boolean;
}) {
  return toast[type](message, {
    duration: persist ? Infinity : 3000,
    dismissible: persist,
    action: action,
  });
}
