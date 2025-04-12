"use client";

import { toast } from "sonner";

export function toastMessage(message: string, description: string) {
  return toast(message, {
    description: description,
    duration: 3000,
  });
}
