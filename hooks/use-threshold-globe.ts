"use client";

import { geoOrthographic, geoPath } from "d3-geo";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import land110m from "world-atlas/land-110m.json";

export interface ThresholdGlobeOptions {
  /** Rotation speed multiplier — 1 = a full turn every 30s, 0 = frozen. */
  rotationSpeed?: number;
  /** Cell size in CSS pixels. Smaller = higher apparent resolution, more cells drawn. */
  cellSize?: number;
  /** Max redraws per second. The shipped original throttles hard to 9fps on purpose. */
  fpsCap?: number;
  /** Dot color, any canvas fillStyle-compatible string. */
  dotColor?: string;
}

const landFeature = feature(
  land110m as unknown as Topology,
  (land110m as unknown as Topology).objects.land,
);

function hash(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function threshold(cx: number, cy: number, t: number, landAlpha: number) {
  const wave =
    (Math.sin(cx * 0.27 + t * 2e-4) + Math.sin(cy * 0.19 - t * 1.5e-4) + 2) / 4;
  return 0.05 + landAlpha * (0.42 + wave * 0.28);
}

/**
 * Renders a rotating dot-globe: a real d3 orthographic projection of world
 * land, sampled at very low resolution and drawn as a dithered grid — every
 * cell's visibility is a fixed per-position hash crossed by a slow threshold
 * wave, so cells shimmer with zero per-dot state to track.
 */
export function useThresholdGlobe({
  rotationSpeed = 1,
  cellSize = 6,
  fpsCap = 9,
  dotColor = "#fff3bd",
}: ThresholdGlobeOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let reduceMotion = reduceMotionQuery.matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0;
    let ch = 0;
    const startTime = performance.now();
    let lastFrame = 0;
    let raf = 0;

    const rotationMs =
      rotationSpeed > 0 ? 30000 / rotationSpeed : Number.POSITIVE_INFINITY;

    function longitudeAt(t: number) {
      return reduceMotion ? -18 : -18 + (t / rotationMs) * 360;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      if (!octx) return;
      if (!reduceMotion && now - lastFrame < 1000 / fpsCap) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;

      const gridW = Math.max(1, Math.ceil(cw / cellSize));
      const gridH = Math.max(1, Math.ceil(ch / cellSize));
      if (off.width !== gridW || off.height !== gridH) {
        off.width = gridW;
        off.height = gridH;
      }

      const lon = longitudeAt(now - startTime);
      const projection = geoOrthographic()
        .translate([gridW / 2, gridH / 2])
        .scale(Math.min(gridW, gridH) * 0.47)
        .rotate([lon, -12])
        .clipAngle(90);
      const path = geoPath(projection, octx);

      octx.clearRect(0, 0, gridW, gridH);
      octx.beginPath();
      path(landFeature);
      octx.fillStyle = "#fff";
      octx.fill();

      const data = octx.getImageData(0, 0, gridW, gridH).data;
      const cx0 = gridW / 2;
      const cy0 = gridH / 2;
      const r0 = Math.min(gridW, gridH) * 0.47;
      const t = now - startTime;

      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = dotColor;

      for (let cyi = 0; cyi < gridH; cyi++) {
        for (let cxi = 0; cxi < gridW; cxi++) {
          const dx = cxi + 0.5 - cx0;
          const dy = cyi + 0.5 - cy0;
          if (dx * dx + dy * dy > r0 * r0) continue;
          const a = data[(cyi * gridW + cxi) * 4 + 3] / 255;
          const th = threshold(cxi, cyi, t, a);
          if (hash(cxi, cyi) > th) continue;
          ctx.fillRect(
            cxi * cellSize + 1,
            cyi * cellSize + 1,
            cellSize - 2,
            cellSize - 2,
          );
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    function restart() {
      if (raf) cancelAnimationFrame(raf);
      resize();
      lastFrame = 0;
      raf = requestAnimationFrame(draw);
    }

    const onReduceMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      restart();
    };
    reduceMotionQuery.addEventListener("change", onReduceMotionChange);

    const resizeObserver = new ResizeObserver(() => restart());
    resizeObserver.observe(canvas);

    restart();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      reduceMotionQuery.removeEventListener("change", onReduceMotionChange);
    };
    // Sliders are read once per mount by design — the original component
    // treats them as construction-time options, not live reactive props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotationSpeed, cellSize, fpsCap, dotColor]);

  return canvasRef;
}
