import React, { useState, useEffect, useRef, useCallback } from "react";

const CAT_COUNT = 5;
const CAT_SIZE = 36;
const CAT_OFFSET = 18;
const DONT_CLICK_INTERVAL = 3200;
const DONT_CLICK_DURATION = 2200;
const CAT_COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f472b6", "#fbbf24"];

function makeCat(id, offset) {
  return {
    id,
    pos: (offset * (400 / CAT_COUNT)) % 400,
    state: "walking",
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    launchOrigin: null,
  };
}

function perimToXY(p, w, h) {
  if (p <= 100) return { x: (p / 100) * w, y: -CAT_OFFSET, rot: 0 };
  if (p <= 200) return { x: w + CAT_OFFSET, y: ((p - 100) / 100) * h, rot: 90 };
  if (p <= 300)
    return { x: w - ((p - 200) / 100) * w, y: h + CAT_OFFSET, rot: 180 };
  return { x: -CAT_OFFSET, y: h - ((p - 300) / 100) * h, rot: 270 };
}

const CatSVG = ({ color }) => (
  <svg
    viewBox="0 0 44 34"
    width={CAT_SIZE}
    height={CAT_SIZE * 0.77}
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: "visible" }}
  >
    <ellipse cx="20" cy="22" rx="13" ry="9" fill={color} opacity="0.62" />
    <circle cx="29" cy="14" r="8" fill={color} opacity="0.68" />
    <polygon points="23,9 21,3 27,8" fill={color} opacity="0.85" />
    <polygon points="32,9 34,3 37,8" fill={color} opacity="0.85" />
    <ellipse cx="27" cy="13" rx="1.8" ry="2.1" fill="rgba(8,14,28,0.75)" />
    <ellipse cx="32" cy="13" rx="1.8" ry="2.1" fill="rgba(8,14,28,0.75)" />
    <circle cx="27.7" cy="12.2" r="0.7" fill="white" opacity="0.9" />
    <circle cx="32.7" cy="12.2" r="0.7" fill="white" opacity="0.9" />
    <ellipse
      cx="29.5"
      cy="16.5"
      rx="1.2"
      ry="0.8"
      fill="rgba(255,100,100,0.8)"
    />
    <line
      x1="22"
      y1="16"
      x2="16"
      y2="15"
      stroke={color}
      strokeWidth="1.1"
      opacity="0.5"
    />
    <line
      x1="22"
      y1="17.5"
      x2="16"
      y2="18.5"
      stroke={color}
      strokeWidth="1.1"
      opacity="0.5"
    />
    <line
      x1="37"
      y1="16"
      x2="43"
      y2="15"
      stroke={color}
      strokeWidth="1.1"
      opacity="0.5"
    />
    <line
      x1="37"
      y1="17.5"
      x2="43"
      y2="18.5"
      stroke={color}
      strokeWidth="1.1"
      opacity="0.5"
    />
    <path
      d="M7,22 Q0,15 3,8"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.68"
    />
    <line
      x1="13"
      y1="29"
      x2="11"
      y2="34"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.68"
      style={{
        animation: "catLegA 0.42s ease infinite alternate",
        transformOrigin: "13px 29px",
      }}
    />
    <line
      x1="18"
      y1="30"
      x2="19"
      y2="35"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.68"
      style={{
        animation: "catLegB 0.42s ease infinite alternate",
        transformOrigin: "18px 30px",
      }}
    />
    <line
      x1="23"
      y1="29"
      x2="22"
      y2="34"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.68"
      style={{
        animation: "catLegA 0.42s ease 0.21s infinite alternate",
        transformOrigin: "23px 29px",
      }}
    />
    <line
      x1="28"
      y1="30"
      x2="30"
      y2="35"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.68"
      style={{
        animation: "catLegB 0.42s ease 0.21s infinite alternate",
        transformOrigin: "28px 30px",
      }}
    />
  </svg>
);

const DontClickBubble = ({ x, y, visible }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - 10,
      transform: visible
        ? "translate(-50%, -100%) scale(1)"
        : "translate(-50%, -90%) scale(0.85)",
      background: "rgba(12,20,44,0.92)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(168,85,247,0.5)",
      borderRadius: 14,
      padding: "5px 11px",
      fontSize: 11,
      fontWeight: 800,
      color: "#c084fc",
      fontFamily: "'Quicksand', sans-serif",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 30,
      opacity: visible ? 1 : 0,
      transition:
        "opacity 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow: "0 4px 16px rgba(168,85,247,0.18)",
      letterSpacing: 0.2,
    }}
  >
    don't click me
    <div
      style={{
        position: "absolute",
        bottom: -5,
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        borderTop: "5px solid rgba(12,20,44,0.92)",
      }}
    />
  </div>
);

const WalkingCats = ({ cardRef }) => {
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [cats, setCats] = useState(() =>
    Array.from({ length: CAT_COUNT }, (_, i) => makeCat(i, i)),
  );
  const [dontClickCat, setDontClickCat] = useState(null);

  const catsRef = useRef(cats);
  catsRef.current = cats;

  const dontClickTimerRef = useRef(null);
  const dontClickHideRef = useRef(null);

  useEffect(() => {
    if (!cardRef?.current) return;
    const update = () => {
      if (!cardRef.current) return;
      setDims({
        w: cardRef.current.offsetWidth,
        h: cardRef.current.offsetHeight,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [cardRef]);

  useEffect(() => {
    const cycle = () => {
      const walking = catsRef.current.filter((c) => c.state === "walking");
      if (walking.length > 0) {
        const chosen = walking[Math.floor(Math.random() * walking.length)];
        setDontClickCat(chosen.id);
        dontClickHideRef.current = setTimeout(
          () => setDontClickCat(null),
          DONT_CLICK_DURATION,
        );
      }
      dontClickTimerRef.current = setTimeout(cycle, DONT_CLICK_INTERVAL);
    };
    dontClickTimerRef.current = setTimeout(cycle, 2000);
    return () => {
      clearTimeout(dontClickTimerRef.current);
      clearTimeout(dontClickHideRef.current);
    };
  }, []);

  useEffect(() => {
    let raf;
    const SPEED = 0.2;
    const GRAVITY = 0.58;
    const OFF_SCREEN_Y = window.innerHeight + 250;

    const tick = () => {
      setCats((prev) =>
        prev.map((cat) => {
          if (cat.state === "walking") {
            return { ...cat, pos: (cat.pos + SPEED) % 400 };
          }
          const nvx = cat.vx * 0.991;
          const nvy = cat.vy + GRAVITY;
          const npx = cat.px + nvx;
          const npy = cat.py + nvy;
          const pageY = cat.launchOrigin ? cat.launchOrigin.y + npy : npy;
          if (pageY > OFF_SCREEN_Y) {
            return {
              ...makeCat(cat.id, 0),
              pos: (cat.pos + 60 + Math.random() * 100) % 400,
            };
          }
          return { ...cat, vx: nvx, vy: nvy, px: npx, py: npy };
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCatClick = useCallback(
    (e, catId) => {
      e.stopPropagation();
      const clickX = e.clientX;
      const clickY = e.clientY;
      setCats((prev) =>
        prev.map((cat) => {
          if (cat.id !== catId || cat.state !== "walking") return cat;
          return {
            ...cat,
            state: "launched",
            launchOrigin: { x: clickX, y: clickY },
            px: 0,
            py: 0,
            vx: (Math.random() - 0.5) * 10,
            vy: -(15 + Math.random() * 7),
          };
        }),
      );
      if (dontClickCat === catId) setDontClickCat(null);
    },
    [dontClickCat],
  );

  if (dims.w === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
        overflow: "visible",
      }}
    >
      {cats.map((cat) => {
        const color = CAT_COLORS[cat.id % CAT_COLORS.length];

        if (cat.state === "walking") {
          const { x, y, rot } = perimToXY(cat.pos, dims.w, dims.h);
          return (
            <React.Fragment key={cat.id}>
              <DontClickBubble x={x} y={y} visible={dontClickCat === cat.id} />
              <div
                onClick={(e) => handleCatClick(e, cat.id)}
                style={{
                  position: "absolute",
                  left: x - CAT_SIZE / 2,
                  top: y - CAT_SIZE / 2,
                  width: CAT_SIZE,
                  height: CAT_SIZE * 0.77,
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: "center center",
                  cursor: "pointer",
                  pointerEvents: "all",
                  willChange: "left, top",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
                  transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter =
                    "drop-shadow(0 2px 12px rgba(255,255,255,0.2)) brightness(1.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter =
                    "drop-shadow(0 2px 8px rgba(0,0,0,0.35))")
                }
              >
                <CatSVG color={color} />
              </div>
            </React.Fragment>
          );
        }

        if (!cat.launchOrigin) return null;
        const cardRect = cardRef.current?.getBoundingClientRect();
        if (!cardRect) return null;
        const originX = cat.launchOrigin.x - cardRect.left;
        const originY = cat.launchOrigin.y - cardRect.top;

        return (
          <div
            key={cat.id}
            style={{
              position: "absolute",
              left: originX + cat.px - CAT_SIZE / 2,
              top: originY + cat.py - CAT_SIZE * 0.4,
              width: CAT_SIZE,
              height: CAT_SIZE * 0.77,
              pointerEvents: "none",
              transform: `rotate(${cat.vx * 18}deg) scaleX(${cat.vx < 0 ? -1 : 1})`,
              filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.45))",
            }}
          >
            <CatSVG color={color} />
          </div>
        );
      })}
    </div>
  );
};

export default WalkingCats;
