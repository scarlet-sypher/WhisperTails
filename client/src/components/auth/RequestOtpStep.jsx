import React, { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

const AUTH_ACCENT = {
  primary: "#3b82f6",
  light: "#60a5fa",
  glow: "rgba(59,130,246,0.35)",
  ring: "rgba(59,130,246,0.5)",
};

function inputStyle(focused, accent = AUTH_ACCENT) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? accent.primary : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10,
    padding: "10px 40px",
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

const RequestOtp = ({
  formData,
  loading,
  handleInputChange,
  handleRequestOTP,
  accent = AUTH_ACCENT,
  setActiveField,
}) => {
  const [focused, setFocused] = useState(false);

  const onFocus = () => {
    setFocused(true);
    setActiveField?.("email");
  };

  const onBlur = () => {
    setFocused(false);
    setActiveField?.(null);
  };

  return (
    <form
      onSubmit={handleRequestOTP}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 5,
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(148,163,184,0.8)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Email Address
        </label>
        <div style={{ position: "relative" }}>
          <Mail
            size={14}
            color={focused ? accent.light : "rgba(148,163,184,0.45)"}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              transition: "color 0.3s ease",
            }}
          />
          <input
            className="auth-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Enter your registered email"
            required
            style={inputStyle(focused, accent)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="auth-submit-btn"
        style={{
          width: "100%",
          padding: "11px 0",
          marginTop: 2,
          borderRadius: 10,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          fontWeight: 800,
          fontSize: 14,
          background: loading
            ? "rgba(100,116,139,0.4)"
            : `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
          color: loading ? "rgba(148,163,184,0.6)" : "white",
          boxShadow: loading ? "none" : `0 6px 20px ${accent.glow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          opacity: loading ? 0.7 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {loading ? (
          <>
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>

      <p
        style={{
          marginTop: 3,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(148,163,184,0.6)",
          fontWeight: 500,
        }}
      >
        Remember your password?{" "}
        <a
          href="/login"
          style={{
            color: accent.light,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Back to Login
        </a>
      </p>
    </form>
  );
};

export default RequestOtp;
