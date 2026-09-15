"use client";

import type { CSSProperties } from "react";
import {
  type ThresholdGlobeOptions,
  useThresholdGlobe,
} from "@/hooks/use-threshold-globe";

export interface ThresholdGlobeProps extends ThresholdGlobeOptions {
  className?: string;
  style?: CSSProperties;
  /** Globe diameter, as a percentage of the container's width. */
  size?: number;
  /** Horizontal position of the globe's center, as a percentage of the container's width. */
  positionX?: number;
  /** Vertical position of the globe's center, as a percentage of the container's height. */
  positionY?: number;
}

/**
 * A rotating dot-globe reverse-engineered from Cloudflare's animated
 * login-page background: a real orthographic projection of world land,
 * sampled at very low resolution and dithered into a shimmering grid.
 *
 * Positioned absolutely within its parent (which needs `position: relative`
 * and, usually, `overflow: hidden` — the globe is meant to bleed off the
 * frame at the default size, the way the shipped original does).
 */
export function ThresholdGlobe({
  className,
  style,
  size = 100,
  positionX = 50,
  positionY = 50,
  ...options
}: ThresholdGlobeProps) {
  const canvasRef = useThresholdGlobe(options);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating dot-globe"
      className={className}
      style={{
        display: "block",
        position: "absolute",
        left: `${positionX}%`,
        top: `${positionY}%`,
        width: `${size}%`,
        aspectRatio: "1 / 1",
        maxWidth: "none",
        transform: "translate(-50%, -50%)",
        ...style,
      }}
    />
  );
}
