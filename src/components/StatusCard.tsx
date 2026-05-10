"use client";

import { type FCMStatus } from "@/hooks/useFCM";

interface StatusCardProps {
  status: FCMStatus;
  token: string | null;
  onRequestPermission: () => void;
  onRefreshToken: () => void;
}

const STATUS_CONFIG: Record<
  FCMStatus,
  { label: string; badgeClass: string; dotColor: string }
> = {
  idle: {
    label: "Not configured",
    badgeClass: "badge badge-neutral",
    dotColor: "var(--text-muted)",
  },
  loading: {
    label: "Initializing…",
    badgeClass: "badge badge-warning",
    dotColor: "var(--accent-warning)",
  },
  granted: {
    label: "Active",
    badgeClass: "badge badge-success",
    dotColor: "var(--accent-success)",
  },
  denied: {
    label: "Permission Denied",
    badgeClass: "badge badge-danger",
    dotColor: "var(--accent-danger)",
  },
  unsupported: {
    label: "Not Supported",
    badgeClass: "badge badge-neutral",
    dotColor: "var(--text-muted)",
  },
};

export function StatusCard({
  status,
  token,
  onRequestPermission,
  onRefreshToken,
}: StatusCardProps) {
  const cfg = STATUS_CONFIG[status];

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
              background: "linear-gradient(135deg, #6c63ff22, #6c63ff44)",
              border: "1px solid rgba(108,99,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🔔
          </div>
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Push Notifications
            </h2>
            <p
              style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}
            >
              Firebase Cloud Messaging
            </p>
          </div>
        </div>

        <span className={cfg.badgeClass}>
          <span className="dot-pulse" style={{ color: cfg.dotColor }} />
          {cfg.label}
        </span>
      </div>

      <div className="divider" style={{ marginBottom: "24px" }} />

      {/* Token area */}
      {status === "granted" && token ? (
        <div>
          <span className="label">Your FCM Device Token</span>
          <div
            className="code-block"
            style={{ fontSize: "0.72rem", marginBottom: "12px" }}
          >
            {token}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              id="copy-token-btn"
              className="btn-secondary"
              style={{ fontSize: "0.78rem", padding: "8px 14px" }}
              onClick={() => navigator.clipboard.writeText(token)}
            >
              📋 Copy token
            </button>
            <button
              id="refresh-token-btn"
              className="btn-secondary"
              style={{ fontSize: "0.78rem", padding: "8px 14px" }}
              onClick={onRefreshToken}
              title="Delete stale token and generate a fresh one"
            >
              🔄 Refresh token
            </button>
          </div>
        </div>
      ) : status === "denied" ? (
        <div
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 10,
            padding: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              color: "#fca5a5",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "var(--accent-danger)" }}>
              Notifications are blocked.
            </strong>{" "}
            To fix this, click the{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              tune / lock icon
            </strong>{" "}
            next to the URL bar → reset Notifications to{" "}
            <strong style={{ color: "var(--text-primary)" }}>Allow</strong>,
            then refresh.
          </p>
        </div>
      ) : status === "unsupported" ? (
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Your browser does not support push notifications.
        </p>
      ) : (
        <div>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-secondary)",
              marginBottom: "16px",
              lineHeight: 1.6,
            }}
          >
            Enable push notifications to receive real-time alerts even when the
            tab is in the background.
          </p>
          <button
            id="enable-notifications-btn"
            className="btn-primary"
            onClick={onRequestPermission}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span
                  className="spinning"
                  style={{ display: "inline-block", fontSize: "0.9rem" }}
                >
                  ⟳
                </span>
                Initializing…
              </>
            ) : (
              <>🔔 Enable Notifications</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
