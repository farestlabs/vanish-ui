"use client";

import { useState } from "react";
import { ThresholdGlobe } from "@/components/threshold-globe";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const palettes = [
  { bg: "#ff5e1f", dot: "#fff3bd", label: "as shipped" },
  { bg: "#0a1420", dot: "#4fe3d1", label: "cyan / ink" },
  { bg: "#180f2e", dot: "#e3b8ff", label: "violet / ink" },
];

export function ThresholdGlobePlayground() {
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [cellSize, setCellSize] = useState(6);
  const [fpsCap, setFpsCap] = useState(9);
  const [palette, setPalette] = useState(palettes[0]);
  const [size, setSize] = useState(78);
  const [positionX, setPositionX] = useState(79);
  const [positionY, setPositionY] = useState(50);

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
        <div
          className="relative aspect-video"
          style={{ backgroundColor: palette.bg }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${palette.bg} 0%, transparent 62%)`,
            }}
          />
          <ThresholdGlobe
            key={palette.dot}
            rotationSpeed={rotationSpeed}
            cellSize={cellSize}
            fpsCap={fpsCap}
            dotColor={palette.dot}
            size={size}
            positionX={positionX}
            positionY={positionY}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-lg border border-foreground/10 p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rotation">Rotation speed</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {rotationSpeed.toFixed(1)}×
            </span>
          </div>
          <Slider
            id="rotation"
            min={0}
            max={3}
            step={0.1}
            value={[rotationSpeed]}
            onValueChange={([v]) => setRotationSpeed(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cellsize">Cell size</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {cellSize}px
            </span>
          </div>
          <Slider
            id="cellsize"
            min={3}
            max={14}
            step={1}
            value={[cellSize]}
            onValueChange={([v]) => setCellSize(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fpscap">Throttle</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {fpsCap}fps
            </span>
          </div>
          <Slider
            id="fpscap"
            min={2}
            max={60}
            step={1}
            value={[fpsCap]}
            onValueChange={([v]) => setFpsCap(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="size">Size</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {size}%
            </span>
          </div>
          <Slider
            id="size"
            min={20}
            max={130}
            step={1}
            value={[size]}
            onValueChange={([v]) => setSize(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="posx">Position X</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {positionX}%
            </span>
          </div>
          <Slider
            id="posx"
            min={0}
            max={100}
            step={1}
            value={[positionX]}
            onValueChange={([v]) => setPositionX(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="posy">Position Y</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {positionY}%
            </span>
          </div>
          <Slider
            id="posy"
            min={0}
            max={100}
            step={1}
            value={[positionY]}
            onValueChange={([v]) => setPositionY(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Palette</Label>
          <div className="flex items-center gap-2">
            {palettes.map((p) => (
              <button
                key={p.dot}
                type="button"
                title={p.label}
                aria-label={`Use ${p.label} palette`}
                aria-pressed={palette.dot === p.dot}
                onClick={() => setPalette(p)}
                className="size-6 rounded-full ring-1 ring-foreground/10 ring-offset-2 ring-offset-background transition-shadow"
                style={{
                  backgroundColor: p.bg,
                  boxShadow:
                    palette.dot === p.dot
                      ? "0 0 0 2px var(--foreground)"
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
