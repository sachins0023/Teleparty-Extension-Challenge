import { toast } from "sonner";

export function formatTimestamp(timestamp: number): {
  date: string;
  time: string;
  isToday: boolean;
} {
  const dateObj = new Date(timestamp);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = dateObj.getFullYear();
  const date = `${day}-${month}-${year}`;

  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const isToday =
    dateObj.getDate() === now.getDate() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getFullYear() === now.getFullYear();

  return { date, time, isToday };
}

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
