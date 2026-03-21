import React from "react";

const RippleWave = ({ ripple }) => {
  if (!ripple) return null;
  return (
    <div
      key={ripple.id}
      style={{
        position: "fixed",
        left: ripple.x,
        top: ripple.y,
        width: 0,
        height: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background: ripple.color,
          animation: "rippleExpand 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      />
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          border: `2px solid ${ripple.ringColor}`,
          animation: "rippleRing 1.4s cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      />
    </div>
  );
};

export default RippleWave;
