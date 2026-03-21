import React, { useState, useRef, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  PawPrint,
  Building2,
  Loader2,
} from "lucide-react";
import { scorePassword } from "./Mascot";
import WalkingCats from "./cats/WalkingCats";
import StrengthBar from "./StrengthBar";

function sanitizeEmail(val) {
  return val.replace(/[^a-zA-Z0-9.@\-_+]/g, "").trimStart();
}

function sanitizePassword(val) {
  return val.replace(/[\x00-\x1F\x7F]/g, "");
}

function inputStyle(focused, accent) {
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

const LoginForm = ({
  formData,
  loading,
  message,
  showPass,
  activeField,
  role,
  accent,
  handleInputChange,
  handleSubmit,
  setShowPass,
  setActiveField,
  setRole,
  API_URL,
  cardRef,
}) => {
  const passwordRef = useRef(null);
  const passwordStrength = scorePassword(formData.password);

  const onEmailChange = (e) => {
    handleInputChange({
      target: { name: "email", value: sanitizeEmail(e.target.value) },
    });
  };

  const onPasswordChange = (e) => {
    handleInputChange({
      target: { name: "password", value: sanitizePassword(e.target.value) },
    });
  };

  const togglePassword = () => {
    setShowPass((p) => !p);
    setTimeout(() => {
      passwordRef.current?.focus();
      setActiveField("password");
    }, 0);
  };

  return (
    <div
      ref={cardRef}
      style={{
        flex: 1,
        background: "rgba(8,14,28,0.78)",
        backdropFilter: "blur(28px) saturate(1.5)",
        WebkitBackdropFilter: "blur(28px) saturate(1.5)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        padding: "28px 28px 24px",
        boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${accent.glow}`,
        transition: "box-shadow 0.5s ease",
        position: "relative",
        overflow: "visible",
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent.light}, transparent)`,
          opacity: 0.6,
          transition: "background 0.5s ease",
          pointerEvents: "none",
          borderRadius: "20px 20px 0 0",
        }}
      />

      <WalkingCats cardRef={cardRef} accent={accent} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 20,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${accent.primary}, ${accent.light})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 16px ${accent.glow}`,
            transition: "all 0.5s ease",
            flexShrink: 0,
          }}
        >
          <PawPrint size={17} color="white" strokeWidth={2.5} />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              background: `linear-gradient(135deg, #e2e8f0, ${accent.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transition: "all 0.5s ease",
              backgroundColor: "transparent",
            }}
          >
            WhisperTails
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(148,163,184,0.6)",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Pet Adoption Portal
          </div>
        </div>
      </div>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#f1f5f9",
          marginBottom: 4,
          letterSpacing: -0.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        Welcome Back
      </h2>
      <p
        style={{
          fontSize: 12,
          color: "rgba(148,163,184,0.7)",
          marginBottom: 18,
          fontWeight: 500,
          position: "relative",
          zIndex: 2,
        }}
      >
        Sign in to continue your adoption journey
      </p>

      <div
        style={{
          display: "flex",
          background: "rgba(0,0,0,0.25)",
          borderRadius: 10,
          padding: 3,
          marginBottom: 18,
          border: "1px solid rgba(255,255,255,0.07)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {[
          { key: "owner", label: "Pet Owner", Icon: PawPrint },
          { key: "shelter", label: "Shelter", Icon: Building2 },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            className="role-btn"
            onClick={() => setRole(key)}
            style={{
              flex: 1,
              padding: "7px 0",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              background:
                role === key
                  ? `linear-gradient(135deg, ${accent.primary}, ${accent.light})`
                  : "transparent",
              color: role === key ? "white" : "rgba(148,163,184,0.7)",
              boxShadow: role === key ? `0 4px 14px ${accent.glow}` : "none",
              transition: "all 0.4s ease",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Icon size={13} strokeWidth={2.5} /> {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="google-btn"
        onClick={() => {
          window.location.href = `${API_URL}/api/auth/google/login`;
        }}
        style={{
          width: "100%",
          padding: "9px 0",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.11)",
          borderRadius: 10,
          cursor: "pointer",
          color: "#e2e8f0",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 13,
          transition: "all 0.3s ease",
          position: "relative",
          zIndex: 2,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20H24v8h11.3C33.7 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.5 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.9 6.5 29.2 4 24 4 16 4 9.1 8.4 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.3-5.3C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.2 39.7 16 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.6 6.1l6.3 5.3C40.9 35.7 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"
          />
        </svg>
        Continue with Google
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(148,163,184,0.5)",
            fontWeight: 600,
          }}
        >
          or
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {message.text && (
        <div
          style={{
            marginBottom: 14,
            padding: "9px 12px",
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 7,
            background:
              message.type === "error"
                ? "rgba(239,68,68,0.12)"
                : "rgba(34,197,94,0.12)",
            border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)"}`,
            color: message.type === "error" ? "#f87171" : "#4ade80",
            animation:
              message.type === "error" ? "shake 0.4s ease" : "fadeUp 0.3s ease",
            position: "relative",
            zIndex: 2,
          }}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          zIndex: 2,
        }}
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
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail
              size={14}
              color={
                activeField === "email"
                  ? accent.light
                  : "rgba(148,163,184,0.45)"
              }
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                transition: "color 0.3s ease",
                pointerEvents: "none",
              }}
            />
            <input
              className="login-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={onEmailChange}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              maxLength={254}
              style={inputStyle(activeField === "email", accent)}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(148,163,184,0.8)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <button
              type="button"
              style={{
                fontSize: 11,
                color: accent.light,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                transition: "opacity 0.2s",
              }}
              onClick={() => (window.location.href = "/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <Lock
              size={14}
              color={
                activeField === "password"
                  ? accent.light
                  : "rgba(148,163,184,0.45)"
              }
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                transition: "color 0.3s ease",
                pointerEvents: "none",
              }}
            />
            <input
              className="login-input"
              ref={passwordRef}
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onPasswordChange}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              maxLength={128}
              style={{
                ...inputStyle(activeField === "password", accent),
                paddingRight: 40,
              }}
            />
            <button
              type="button"
              onClick={togglePassword}
              style={{
                position: "absolute",
                right: 12,
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
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {formData.password.length > 0 && (
            <StrengthBar strength={passwordStrength} />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
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
            transition: "all 0.3s ease",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 12,
          color: "rgba(148,163,184,0.6)",
          fontWeight: 500,
          position: "relative",
          zIndex: 2,
        }}
      >
        Don't have an account?{" "}
        <a
          href="/signupOwner"
          style={{
            color: accent.light,
            textDecoration: "none",
            fontWeight: 700,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Sign up as Owner
        </a>
        {" or "}
        <a
          href="/signupShelter"
          style={{
            color: accent.light,
            textDecoration: "none",
            fontWeight: 700,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Sign up as Shelter
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
