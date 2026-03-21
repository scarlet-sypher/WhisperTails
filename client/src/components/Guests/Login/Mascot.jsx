import React, { useState, useEffect, useRef } from "react";
import PetMascot from "./mascotComponents/PetMascot";
import ThoughtBubble from "./mascotComponents/ThoughtBubble";
import {
  useEyeTracking,
  useSleepPhase,
  useCursorChaos,
} from "./mascotComponents/hooks";
import { MESSAGES } from "./mascotComponents/messages";

export { scorePassword } from "./mascotComponents/utils";

const Mascot = ({
  mascotState,
  accent,
  typingSpeed,
  validationHint,
  showPass,
  isBackHover,
  roleJustSwitched,
  passwordStrength,
  errorKey,
}) => {
  const mascotRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const prevErrorKey = useRef(null);

  const isCursorChaos = useCursorChaos();
  const isPasswordField = mascotState === "password";
  const eyeOffset = useEyeTracking(mascotRef, isPasswordField && !showPass);
  const isSleeping = typingSpeed === "sleepy";
  const sleepPhase = useSleepPhase(isSleeping);

  const [idleEyelid, setIdleEyelid] = useState(0);
  const [shakeAnim, setShakeAnim] = useState("none");

  useEffect(() => {
    const update = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", update, { passive: true });
    window.addEventListener("keydown", update, { passive: true });
    return () => {
      window.removeEventListener("mousemove", update);
      window.removeEventListener("keydown", update);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const idle = Date.now() - lastActivityRef.current;
      setIdleEyelid(idle > 6000 ? 0.65 : 0);
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!errorKey || errorKey === prevErrorKey.current) return;
    prevErrorKey.current = errorKey;
    setShakeAnim("none");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setShakeAnim(
          "errorImpact 0.55s cubic-bezier(0.36,0.07,0.19,0.97) both",
        );
      }),
    );
  }, [errorKey]);

  let eyelidAmount = idleEyelid;
  if (isPasswordField && !showPass) eyelidAmount = 1;
  else if (isPasswordField && showPass) eyelidAmount = 0;
  else if (isSleeping) eyelidAmount = 0.75 + sleepPhase * 0.25;

  const displayState = resolveDisplayState({
    isCursorChaos,
    isBackHover,
    roleJustSwitched,
    mascotState,
    validationHint,
    showPass,
    passwordStrength,
    typingSpeed,
    isPasswordField,
  });

  const [shownState, setShownState] = useState(displayState);
  const [msgVisible, setMsgVisible] = useState(true);

  useEffect(() => {
    setMsgVisible(false);
    const t = setTimeout(() => {
      setShownState(displayState);
      setMsgVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [displayState]);

  const baseAnim =
    mascotState === "success"
      ? "mascotBounce 0.65s ease"
      : roleJustSwitched
        ? "mascotBounce 0.5s ease"
        : isCursorChaos
          ? "mascotShake 0.6s ease"
          : "none";

  const finalAnim = shakeAnim !== "none" ? shakeAnim : baseAnim;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
        minWidth: 240,
      }}
    >
      <ThoughtBubble
        msg={MESSAGES[shownState] || MESSAGES.idle}
        visible={msgVisible}
        accent={accent}
        state={shownState}
      />
      <div ref={mascotRef} style={{ animation: finalAnim }}>
        <PetMascot
          state={shownState}
          eyeOffset={eyeOffset}
          mouthPhase={sleepPhase}
          eyelidAmount={eyelidAmount}
          showQuestion={
            shownState === "emptyEmail" || shownState === "confused"
          }
          isSleeping={isSleeping}
        />
      </div>
    </div>
  );
};

function resolveDisplayState({
  isCursorChaos,
  isBackHover,
  roleJustSwitched,
  mascotState,
  validationHint,
  showPass,
  passwordStrength,
  typingSpeed,
  isPasswordField,
}) {
  if (isCursorChaos) return "cursorChaos";
  if (isBackHover) return "backHover";
  if (roleJustSwitched === "owner") return "tabOwner";
  if (roleJustSwitched === "shelter") return "tabShelter";
  if (mascotState === "success") return "success";

  if (mascotState === "error") {
    if (validationHint === "wrongPassword") return "wrongPassword";
    if (validationHint === "invalidEmail") return "invalidEmail";
    if (validationHint === "emptyEmail") return "emptyEmail";
    return "error";
  }

  if (isPasswordField) {
    if (showPass) {
      if (passwordStrength === "strong") return "passwordStrong";
      if (passwordStrength === "medium") return "passwordMedium";
      if (passwordStrength === "weak") return "passwordWeak";
      return "passwordOpen";
    }
    return "password";
  }

  if (typingSpeed === "fast") return "fastTyping";
  if (typingSpeed === "slow") return "slowTyping";
  if (typingSpeed === "sleepy") return "sleepy";
  if (mascotState === "email") return "email";
  return "idle";
}

export default Mascot;
