"use client";

import { type NotificationItem } from "@/hooks/useFCM";

interface NotificationFeedProps {
  notifications: NotificationItem[];
  onClear: () => void;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function NotificationFeed({ notifications, onClear }: NotificationFeedProps) {
  return (
    <div className="glass-card" style={{ padding: "28px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #10b98122, #10b98144)",
              border: "1px solid rgba(16,185,129,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            📥
          </div>
          <div>
            <h2
              style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}
            >
              Received Notifications
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
              Foreground messages only
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            id="clear-notifications-btn"
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
            onClick={onClear}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divider" style={{ marginBottom: "20px" }} />

      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.4 }}>🔕</div>
          <p style={{ fontSize: "0.85rem" }}>No notifications received yet.</p>
          <p style={{ fontSize: "0.78rem", marginTop: 6 }}>
            Send one using the form above.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {notifications.map((n, i) => (
            <div
              key={n.id}
              className="fade-in-up"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                animationDelay: `${i * 50}ms`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-success)",
                  marginTop: 6,
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {n.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {timeAgo(n.timestamp)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {n.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
