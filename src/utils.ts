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
  duration = 3000,
}: {
  message: string;
  type: "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
  persist?: boolean;
  duration?: number;
}) {
  return toast[type](message, {
    duration: persist ? Infinity : duration,
    dismissible: persist,
    action: action,
  });
}

export function countdownToast({
  initialMessage,
  type = "success",
  action,
  totalDuration = 3000,
  onComplete,
}: {
  initialMessage: string;
  type: "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
  totalDuration?: number;
  onComplete?: () => void;
}) {
  const startTime = Date.now();
  const secondsTotal = Math.floor(totalDuration / 1000);
  let currentSeconds = secondsTotal;

  // Create initial toast and store its ID
  const toastId = toast[type](
    initialMessage.replace("{countdown}", currentSeconds.toString()),
    {
      duration: totalDuration,
      dismissible: true,
      action,
    }
  );

  // Update the toast every second
  const intervalId = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    currentSeconds = Math.max(
      0,
      Math.ceil((totalDuration - elapsedTime) / 1000)
    );

    if (currentSeconds > 0) {
      // Update existing toast
      toast[type](
        initialMessage.replace("{countdown}", currentSeconds.toString()),
        {
          id: toastId,
          duration: totalDuration - elapsedTime,
          dismissible: true,
          action,
        }
      );
    } else {
      clearInterval(intervalId);
      onComplete?.();
    }
  }, 1000);

  // Return function to clear the interval if needed
  return {
    id: toastId,
    clear: () => {
      clearInterval(intervalId);
      toast.dismiss(toastId);
    },
  };
}

export const getSessionDataFromLocalStorage = () => {
  const sessionData = localStorage.getItem("sessionData");
  if (!sessionData) return null;
  const { sessionId, name, imageUrl } = JSON.parse(sessionData);
  return { sessionId, name, imageUrl };
};
