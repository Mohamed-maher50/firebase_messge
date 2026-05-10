"use client";

import { useState } from "react";
import { type SendStatus } from "@/hooks/useSendNotification";

interface SendNotificationCardProps {
  token: string | null;
  onSend: (payload: {
    token: string;
    title: string;
    body: string;
    imageUrl?: string;
  }) => void;
  sendStatus: SendStatus;
}

export function SendNotificationCard({
  token,
  onSend,
  sendStatus,
}: SendNotificationCardProps) {
  const [title, setTitle] = useState("Hello from FCM 👋");
  const [body, setBody] = useState("This is a test push notification.");
  const [imageUrl, setImageUrl] = useState("");
  const [targetToken, setTargetToken] = useState(token ?? "");

  // Keep form token in sync when the prop changes (after permission granted)
  if (token && targetToken === "") {
    setTargetToken(token);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetToken.trim() || !title.trim() || !body.trim()) return;
    onSend({
      token: targetToken.trim(),
      title: title.trim(),
      body: body.trim(),
      ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
    });
  };

  const isSending = sendStatus === "sending";
  const isSuccess = sendStatus === "success";
  const isError = sendStatus === "error";

  return (
    <div className="glass-card" style={{ padding: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "linear-gradient(135deg, #ff658422, #ff658444)",
            border: "1px solid rgba(255,101,132,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          📤
        </div>
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
            Send Notification
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
            Via Firebase Admin SDK
          </p>
        </div>
      </div>

      <div className="divider" style={{ marginBottom: "24px" }} />

      <form id="send-notification-form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Token */}
          <div>
            <label className="label" htmlFor="target-token">Target Device Token</label>
            <textarea
              id="target-token"
              className="input-field"
              rows={2}
              placeholder="Paste a FCM device token…"
              value={targetToken}
              onChange={(e) => setTargetToken(e.target.value)}
            />
          </div>

          {/* Title */}
          <div>
            <label className="label" htmlFor="notif-title">Title</label>
            <input
              id="notif-title"
              className="input-field"
              type="text"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Body */}
          <div>
            <label className="label" htmlFor="notif-body">Body</label>
            <textarea
              id="notif-body"
              className="input-field"
              rows={3}
              placeholder="Notification body message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="label" htmlFor="notif-image">Image URL <span style={{ color: "var(--text-muted)", textTransform: "none", fontSize: "0.73rem" }}>(optional)</span></label>
            <input
              id="notif-image"
              className="input-field"
              type="url"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            id="send-notification-btn"
            type="submit"
            className="btn-primary"
            disabled={isSending || !targetToken.trim() || !title.trim() || !body.trim()}
          >
            {isSending ? (
              <>
                <span className="spinning" style={{ display: "inline-block" }}>⟳</span>
                Sending…
              </>
            ) : (
              <>🚀 Send Notification</>
            )}
          </button>

          {isSuccess && (
            <span className="badge badge-success fade-in-up">✓ Sent!</span>
          )}
          {isError && (
            <span className="badge badge-danger fade-in-up">✗ Failed</span>
          )}
        </div>
      </form>
    </div>
  );
}
