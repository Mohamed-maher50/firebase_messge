"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface SendPayload {
  token: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export type SendStatus = "idle" | "sending" | "success" | "error";

export function useSendNotification() {
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  const sendNotification = async (payload: SendPayload) => {
    setSendStatus("sending");
    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Stale/invalid token — give specific guidance
        if (data.code === "TOKEN_NOT_REGISTERED") {
          throw new Error(
            "Token expired or invalid. Click 'Enable Notifications' again to get a fresh token."
          );
        }
        throw new Error(data.error ?? "Unknown error");
      }

      setLastMessageId(data.messageId);
      setSendStatus("success");
      toast.success("Notification sent!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      setTimeout(() => setSendStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Send notification error:", err);
      setSendStatus("error");
      toast.error(err?.message ?? "Failed to send notification", {
        position: "bottom-right",
        autoClose: 6000,
      });
      setTimeout(() => setSendStatus("idle"), 6000);
    }
  };

  return { sendNotification, sendStatus, lastMessageId };
}
