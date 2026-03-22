// client/src/utils/emailjsService.js
// ─────────────────────────────────────────────────────────────────
//  NEW FILE — all EmailJS sending goes through here
//  emailService.js on the server is NOT touched
// ─────────────────────────────────────────────────────────────────

import emailjs from "@emailjs/browser";

const EJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const _send = async (toEmail, otp, subject, message, name = "User") => {
  await emailjs.send(
    EJS_SERVICE,
    EJS_TEMPLATE,
    { to_email: toEmail, subject, name, message, otp_code: otp },
    EJS_KEY,
  );
};

// For signup email verification
export const sendVerificationOTP = async (toEmail, otp, name = "User") => {
  await _send(
    toEmail,
    otp,
    "Verify Your Email - WhisperTails",
    "To complete your registration, use the verification code below:",
    name,
  );
};

// For forgot password flow
export const sendForgotPasswordOTP = async (toEmail, otp) => {
  await _send(
    toEmail,
    otp,
    "Reset Your Password - WhisperTails",
    "Use the code below to reset your WhisperTails password:",
    "User",
  );
};

// For password change inside owner/shelter profile
export const sendPasswordChangeOTP = async (toEmail, otp, name = "User") => {
  await _send(
    toEmail,
    otp,
    "Password Change OTP - WhisperTails",
    "You requested a password change on your WhisperTails account. Use the code below:",
    name,
  );
};
