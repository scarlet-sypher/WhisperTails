import React, { useState, useRef } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { scorePassword } from "../Guests/Login/mascotComponents/utils.js";
import StrengthBar from "./StrengthBar";

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
    borderRadius: 12,
    padding: "12px 44px",
    color: "#e2e8f0",
    fontSize: 15,
    outline: "none",
    transition: "all 0.3s ease",
    boxShadow: focused
      ? `0 0 0 3px ${accent.ring}, 0 0 20px ${accent.glow}`
      : "none",
    fontFamily: "inherit",
  };
}

const EyeToggle = ({ show, onToggle, accent = AUTH_ACCENT }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "rgba(148,163,184,0.55)",
      padding: 0,
      display: "flex",
      transition: "color 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = accent.light)}
    onMouseLeave={(e) =>
      (e.currentTarget.style.color = "rgba(148,163,184,0.55)")
    }
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

const ResetPassword = ({
  formData,
  loading,
  handleInputChange,
  handleResetPassword,
  accent = AUTH_ACCENT,
  setActiveField,
}) => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedNew, setFocusedNew] = useState(false);
  const [focusedConfirm, setFocusedConfirm] = useState(false);

  const newRef = useRef(null);
  const confirmRef = useRef(null);
  const strength = scorePassword(formData.newPassword);

  const toggleNew = () => {
    setShowNew((p) => !p);
    setTimeout(() => {
      newRef.current?.focus();
      setFocusedNew(true);
      setActiveField?.("newPassword");
    }, 0);
  };

  const toggleConfirm = () => {
    setShowConfirm((p) => !p);
    setTimeout(() => {
      confirmRef.current?.focus();
      setFocusedConfirm(true);
    }, 0);
  };

  return (
    <form
      onSubmit={handleResetPassword}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(148,163,184,0.8)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          New Password
        </label>
        <div style={{ position: "relative" }}>
          <Lock
            size={16}
            color={focusedNew ? accent.light : "rgba(148,163,184,0.45)"}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              transition: "color 0.3s ease",
            }}
          />
          <input
            className="auth-input"
            ref={newRef}
            type={showNew ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            onFocus={() => {
              setFocusedNew(true);
              setActiveField?.("newPassword");
            }}
            onBlur={() => {
              setFocusedNew(false);
              setActiveField?.(null);
            }}
            placeholder="Enter new password"
            required
            minLength={8}
            style={{ ...inputStyle(focusedNew, accent), paddingRight: 44 }}
          />
          <EyeToggle show={showNew} onToggle={toggleNew} accent={accent} />
        </div>
        {formData.newPassword?.length > 0 && (
          <StrengthBar strength={strength} />
        )}
      </div>

      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(148,163,184,0.8)",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Confirm Password
        </label>
        <div style={{ position: "relative" }}>
          <Lock
            size={16}
            color={focusedConfirm ? accent.light : "rgba(148,163,184,0.45)"}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              transition: "color 0.3s ease",
            }}
          />
          <input
            className="auth-input"
            ref={confirmRef}
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onFocus={() => setFocusedConfirm(true)}
            onBlur={() => setFocusedConfirm(false)}
            placeholder="Confirm new password"
            required
            style={{ ...inputStyle(focusedConfirm, accent), paddingRight: 44 }}
          />
          <EyeToggle
            show={showConfirm}
            onToggle={toggleConfirm}
            accent={accent}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="auth-submit-btn"
        style={{
          width: "100%",
          padding: "13px 0",
          marginTop: 4,
          borderRadius: 12,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          fontWeight: 800,
          fontSize: 15,
          background: loading
            ? "rgba(100,116,139,0.4)"
            : `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
          color: loading ? "rgba(148,163,184,0.6)" : "white",
          boxShadow: loading ? "none" : `0 6px 20px ${accent.glow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: loading ? 0.7 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              style={{ animation: "spin 1s linear infinite" }}
            />{" "}
            Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
};

export default ResetPassword;
