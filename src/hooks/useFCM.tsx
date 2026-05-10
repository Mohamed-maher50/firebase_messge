"use client";

import { useEffect, useState, useCallback } from "react";
import {
  deleteToken,
  getToken,
  onMessage,
  type NotificationPayload,
} from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export type FCMStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unsupported";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
}

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<FCMStatus>("idle");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // ── defined FIRST so the useEffect below can reference it ──────────────────
  const initMessaging = useCallback(async () => {
    setStatus("loading");
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        setStatus("unsupported");
        return;
      }

      // Register SW, then wait for it to become fully active.
      // .ready resolves with the active ServiceWorkerRegistration —
      // using the result from .register() alone can fail while still installing.
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const activeRegistration = await navigator.serviceWorker.ready;

      // Delete any cached/stale token first so Firebase always issues a fresh one.
      // Without this, getToken() returns the old (possibly NotRegistered) token.
      try {
        await deleteToken(messaging);
      } catch {
        // No existing token to delete — safe to ignore
      }

      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: activeRegistration,
      });

      setToken(fcmToken);
      setStatus("granted");

      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        const notification = payload.notification as NotificationPayload;
        if (!notification?.title) return;

        setNotifications((prev) => [
          {
            id: Date.now().toString(),
            title: notification.title ?? "",
            body: notification.body ?? "",
            timestamp: new Date(),
          },
          ...prev.slice(0, 9), // keep last 10
        ]);
      });
    } catch (err) {
      console.error("FCM init error:", err);
      setStatus("denied");
    }
  }, []);

  // ── On mount: auto-init if permission already granted ──────────────────────
  useEffect(() => {
    if (typeof Notification === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      initMessaging();
    } else if (Notification.permission === "denied") {
      setStatus("denied");
    }
  }, [initMessaging]);

  // ── Trigger from UI button ─────────────────────────────────────────────────
  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      setStatus("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await initMessaging();
    } else {
      setStatus("denied");
    }
  }, [initMessaging]);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  // ── Force-refresh: delete old token and get a new one ──────────────────────
  const refreshToken = useCallback(async () => {
    setToken(null);
    await initMessaging();
  }, [initMessaging]);

  return {
    token,
    status,
    notifications,
    requestPermission,
    refreshToken,
    clearNotifications,
  };
}
