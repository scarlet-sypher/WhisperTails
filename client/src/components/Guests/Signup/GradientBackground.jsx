import React from "react";

const GradientBackground = ({ role }) => {
  const ownerGrad = `
    radial-gradient(ellipse 120% 90% at 10% 0%,   #0d2554 0%, transparent 55%),
    radial-gradient(ellipse 80%  70% at 90% 100%, #0a3060 0%, transparent 55%),
    radial-gradient(ellipse 60%  50% at 50% 50%,  #061428 0%, transparent 80%),
    linear-gradient(160deg, #060d1c 0%, #0b1630 40%, #07121e 100%)
  `;
  const shelterGrad = `
    radial-gradient(ellipse 120% 90% at 10% 0%,   #3d1206 0%, transparent 55%),
    radial-gradient(ellipse 80%  70% at 90% 100%, #2a1a02 0%, transparent 55%),
    radial-gradient(ellipse 60%  50% at 50% 50%,  #1a0e03 0%, transparent 80%),
    linear-gradient(160deg, #0e0906 0%, #1c1108 40%, #100a04 100%)
  `;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#060d1c",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: role === "owner" ? 1 : 0,
          transition: "opacity 0.9s ease",
          background: ownerGrad,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: role === "shelter" ? 1 : 0,
          transition: "opacity 0.9s ease",
          background: shelterGrad,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.028'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "160px",
          opacity: 0.6,
        }}
      />
    </>
  );
};

export default GradientBackground;
