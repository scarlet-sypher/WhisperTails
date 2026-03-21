import React, { useState } from "react";
import { Loader2 } from "lucide-react";

function inputStyle(focused, accent) {
  return {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1.5px solid ${focused ? accent.primary : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10,
    padding: "10px 16px",
    color: "#e2e8f0",
    fontSize: 22,
    letterSpacing: 10,
    fontWeight: 800,
    textAlign: "center",
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

const OTPScreen = ({
  email,
  formData,
  loading,
  handleInputChange,
  handleVerifyOTP,
  handleResendOTP,
  accent,
}) => {
  const [active, setActive] = useState(false);

  return (
    <form
      onSubmit={handleVerifyOTP}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <p
        style={{
          fontSize: 12,
          color: "rgba(148,163,184,0.7)",
          textAlign: "center",
          marginBottom: 3,
        }}
      >
        We sent a 6-digit code to{" "}
        <span style={{ color: accent.light, fontWeight: 700 }}>{email}</span>
      </p>

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
          Verification Code
        </label>
        <input
          className="auth-input"
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          placeholder="• • • • • •"
          maxLength={6}
          required
          style={inputStyle(active, accent)}
        />
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
        }}
      >
        {loading ? (
          <>
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={handleResendOTP}
        style={{
          width: "100%",
          padding: "9px 0",
          borderRadius: 10,
          border: "1.5px solid rgba(255,255,255,0.11)",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 13,
          background: "rgba(255,255,255,0.04)",
          color: accent.light,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: loading ? 0.5 : 1,
          transition: "all 0.3s ease",
        }}
      >
        Resend Code
      </button>
    </form>
  );
};

export default OTPScreen;
