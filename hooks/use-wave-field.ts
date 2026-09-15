"use client";

import { useEffect, useRef } from "react";

export type WaveEasing = "linear" | "smooth" | "inOut" | "elastic";

const easings: Record<WaveEasing, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  inOut: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  elastic: (t) =>
    t === 0 || t === 1
      ? t
      : 2 ** (-10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1,
};

export interface WaveFieldOptions {
  /** Direction the wave travels across the field, in degrees. */
  angle?: number;
  /** Seconds for one full cycle to pass through a fixed point. */
  duration?: number;
  /** How tightly the wave repeats across space — higher means more visible ripples. */
  frequency?: number;
  easing?: WaveEasing;
  /** Ping-pong (0→1→0) instead of a sawtooth (0→1, snap, repeat). */
  bounce?: boolean;
  min?: number;
  max?: number;
}

/**
 * A deterministic traveling wave: every point (x, y) gets a value in
 * [min, max] that rises and falls as a sine-driven wave sweeps across the
 * field in `angle`'s direction. Pure and framework-agnostic — drive a
 * canvas, an SVG, a WebGL uniform, or (via `useWaveField` below) a plain
 * grid of DOM nodes with it.
 */
export function waveField(
  x: number,
  y: number,
  timeMs: number,
  options: WaveFieldOptions = {},
): number {
  const {
    angle = 0,
    duration = 3,
    frequency = 0.05,
    easing = "smooth",
    bounce = false,
    min = 0,
    max = 1,
  } = options;

  const direction = (angle * Math.PI) / 180;
  const travel = x * Math.cos(direction) + y * Math.sin(direction);
  const rawPhase = ((timeMs / 1000 / duration + travel * frequency) % 1) + 1;
  const phase = rawPhase % 1;
  const t = bounce ? 1 - Math.abs(phase * 2 - 1) : phase;
  const eased = (easings[easing] ?? easings.smooth)(t);

  return min + (max - min) * eased;
}

export interface UseWaveFieldOptions extends WaveFieldOptions {
  /** Grid dimensions, used to derive each cell's (x, y) from its index. */
  columns: number;
  rows: number;
  /** Called every frame for every cell — apply the value however you like. */
  onFrame: (value: number, x: number, y: number, index: number) => void;
}

/**
 * Runs a `waveField` sweep over a `columns` × `rows` grid every animation
 * frame, calling `onFrame` for each cell. Freezes on a single static frame
 * when the user prefers reduced motion.
 */
export function useWaveField({
  columns,
  rows,
  onFrame,
  ...options
}: UseWaveFieldOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let raf = 0;

    function tick(time: number) {
      let index = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++, index++) {
          onFrameRef.current(
            waveField(x, y, time, optionsRef.current),
            x,
            y,
            index,
          );
        }
      }
      if (!reduceMotionQuery.matches) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [columns, rows]);
}
