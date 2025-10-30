import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationEvent {
  type: "badge" | "level_up" | "streak" | "achievement";
  title: string;
  message: string;
  icon: string;
}

/**
 * Hook to handle real-time notifications from the server
 * In a production app, this would connect to a WebSocket or Server-Sent Events
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  useEffect(() => {
    // Listen for custom events from the window
    const handleNotification = (event: CustomEvent<NotificationEvent>) => {
      const { type, title, message, icon } = event.detail;

      // Show toast notification
      showNotificationToast(type, title, message, icon);

      // Add to notifications list
      setNotifications((prev) => [...prev, event.detail]);
    };

    window.addEventListener(
      "gameNotification",
      handleNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "gameNotification",
        handleNotification as EventListener
      );
    };
  }, []);

  return { notifications };
}

/**
 * Show a toast notification based on type
 */
function showNotificationToast(
  type: string,
  title: string,
  message: string,
  icon: string
) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-white/80">{message}</div>
      </div>
    </div>
  );

  switch (type) {
    case "badge":
      toast.success(content, {
        duration: 5000,
        className: "bg-gradient-to-r from-purple-600 to-pink-600 border-0",
      });
      break;
    case "level_up":
      toast.success(content, {
        duration: 5000,
        className: "bg-gradient-to-r from-blue-600 to-purple-600 border-0",
      });
      break;
    case "streak":
      toast.success(content, {
        duration: 5000,
        className: "bg-gradient-to-r from-orange-600 to-red-600 border-0",
      });
      break;
    case "achievement":
      toast.success(content, {
        duration: 5000,
        className: "bg-gradient-to-r from-green-600 to-blue-600 border-0",
      });
      break;
    default:
      toast.info(content, { duration: 5000 });
  }
}

/**
 * Trigger a notification event (typically called from server responses)
 */
export function triggerNotification(notification: NotificationEvent) {
  const event = new CustomEvent("gameNotification", { detail: notification });
  window.dispatchEvent(event);
}
