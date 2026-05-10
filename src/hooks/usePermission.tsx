import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  onMessageListener,
  requestNotificationPermission,
} from "@/lib/firebase";

export const useFirebaseNotifications = ({
  onNotificationReceived,
}: {
  onNotificationReceived?: () => void;
} = {}) => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      if (Notification.permission !== "granted") return;
      
      const token = await requestNotificationPermission();
      console.log("token", token);
      if (!token) return;

        
      unsubscribe = await onMessageListener((payload) => {
        const { title, body } = payload.notification || {};

        toast.success(`${title} ${body}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });

        onNotificationReceived?.();
      });
    };

    init();

    return () => {
      unsubscribe?.();
    };
  }, [onNotificationReceived]);
};
