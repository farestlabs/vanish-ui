"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import type { WaveEasing } from "@/hooks/use-wave-field";
import { useWaveField } from "@/hooks/use-wave-field";

export interface WaveFieldGridProps {
  columns?: number;
  rows?: number;
  gap?: number;
  angle?: number;
  duration?: number;
  frequency?: number;
  easing?: WaveEasing;
  bounce?: boolean;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A grid of cells that pulse as a traveling wave sweeps across them — the
 * animation primitive behind it (`useWaveField`) works on any (x, y, time)
 * input, this is just the common "apply it to a CSS grid" case, updated
 * directly via refs each frame rather than through React state.
 */
export function WaveFieldGrid({
  columns = 12,
  rows = 8,
  gap = 6,
  angle = 0,
  duration = 3,
  frequency = 0.18,
  easing = "smooth",
  bounce = false,
  minScale = 0.35,
  maxScale = 1,
  minOpacity = 0.25,
  maxOpacity = 1,
  color = "currentColor",
  className,
  style,
}: WaveFieldGridProps) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  useWaveField({
    columns,
    rows,
    angle,
    duration,
    frequency,
    easing,
    bounce,
    onFrame: (value, _x, _y, index) => {
      const el = cellRefs.current[index];
      if (!el) return;
      const scale = minScale + (maxScale - minScale) * value;
      const opacity = minOpacity + (maxOpacity - minOpacity) * value;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(opacity);
    },
  });

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {Array.from({ length: columns * rows }, (_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional and never reordered
          key={index}
          ref={(el) => {
            cellRefs.current[index] = el;
          }}
          style={{
            aspectRatio: "1 / 1",
            borderRadius: "9999px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
