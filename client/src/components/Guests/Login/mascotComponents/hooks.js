import { useState, useEffect, useRef } from "react";

export function useEyeTracking(mascotRef, frozen) {
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (frozen || !mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.4;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const norm = (2 / Math.PI) * Math.atan(dist / 180);
      targetRef.current = {
        x: (dx / dist) * norm * 10,
        y: (dy / dist) * norm * 7,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mascotRef, frozen]);

  useEffect(() => {
    if (!frozen) return;
    targetRef.current = { x: 0, y: 0 };
    currentRef.current = { x: 0, y: 0 };
    velRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
  }, [frozen]);

  useEffect(() => {
    const SPRING = 0.14;
    const DAMPING = 0.72;

    const tick = () => {
      const { x: tx, y: ty } = targetRef.current;
      const { x: cx, y: cy } = currentRef.current;
      const { x: vx, y: vy } = velRef.current;

      const ax = (tx - cx) * SPRING;
      const ay = (ty - cy) * SPRING;
      const nvx = vx * DAMPING + ax;
      const nvy = vy * DAMPING + ay;
      const nx = cx + nvx;
      const ny = cy + nvy;

      if (
        Math.abs(nx - cx) > 0.003 ||
        Math.abs(ny - cy) > 0.003 ||
        Math.abs(nvx) > 0.003 ||
        Math.abs(nvy) > 0.003
      ) {
        currentRef.current = { x: nx, y: ny };
        velRef.current = { x: nvx, y: nvy };
        setOffset({ x: nx, y: ny });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return offset;
}

export function useSleepPhase(active) {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setPhase(0);
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const PERIOD = 3000;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % PERIOD;
      setPhase(Math.sin((elapsed / PERIOD) * Math.PI));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active]);

  return phase;
}

export function useCursorChaos() {
  const [isChaos, setChaos] = useState(false);
  const posRef = useRef([]);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const onMove = (e) => {
      const now = Date.now();
      posRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      if (posRef.current.length > 8) posRef.current.shift();
      if (cooldownRef.current || posRef.current.length < 6) return;

      const recent = posRef.current.filter((p) => now - p.t < 300);
      if (recent.length < 5) return;

      let totalDist = 0;
      for (let i = 1; i < recent.length; i++)
        totalDist += Math.hypot(
          recent[i].x - recent[i - 1].x,
          recent[i].y - recent[i - 1].y,
        );

      let dirChanges = 0;
      for (let i = 2; i < recent.length; i++) {
        const a1 = Math.atan2(
          recent[i - 1].y - recent[i - 2].y,
          recent[i - 1].x - recent[i - 2].x,
        );
        const a2 = Math.atan2(
          recent[i].y - recent[i - 1].y,
          recent[i].x - recent[i - 1].x,
        );
        if (Math.abs(a2 - a1) > Math.PI * 0.6) dirChanges++;
      }

      if (totalDist > 600 || (totalDist > 350 && dirChanges >= 2)) {
        setChaos(true);
        cooldownRef.current = true;
        setTimeout(() => {
          setChaos(false);
          cooldownRef.current = false;
        }, 3500);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return isChaos;
}
