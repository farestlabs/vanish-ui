"use client";

import type { CSSProperties } from "react";
import {
  type ThresholdGlobeOptions,
  useThresholdGlobe,
} from "@/hooks/use-threshold-globe";

export interface ThresholdGlobeProps extends ThresholdGlobeOptions {
  className?: string;
  style?: CSSProperties;
}

/**
 * A rotating dot-globe reverse-engineered from Cloudflare's animated
 * login-page background: a real orthographic projection of world land,
 * sampled at very low resolution and dithered into a shimmering grid.
 *
 * Fills its parent — size it with a `width`/`height` (or `aspect-ratio`)
 * on the wrapping element.
 */
export function ThresholdGlobe({
  className,
  style,
  ...options
}: ThresholdGlobeProps) {
  const canvasRef = useThresholdGlobe(options);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating dot-globe"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
