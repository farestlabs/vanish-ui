"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { WaveFieldGrid } from "@/components/wave-field-grid";
import type { WaveEasing } from "@/hooks/use-wave-field";

const easings: WaveEasing[] = ["linear", "smooth", "inOut", "elastic"];
const colors = ["#4fe3d1", "#ff5e1f", "#e3b8ff", "#ffb454"];

export function WaveFieldPlayground() {
  const [angle, setAngle] = useState(35);
  const [duration, setDuration] = useState(2.5);
  const [frequency, setFrequency] = useState(0.22);
  const [easing, setEasing] = useState<WaveEasing>("smooth");
  const [bounce, setBounce] = useState(false);
  const [minScale, setMinScale] = useState(0.35);
  const [color, setColor] = useState(colors[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
        <div className="flex aspect-video items-center justify-center bg-[#0d141c] p-10">
          <WaveFieldGrid
            key={`${easing}-${bounce}`}
            columns={14}
            rows={7}
            color={color}
            angle={angle}
            duration={duration}
            frequency={frequency}
            easing={easing}
            bounce={bounce}
            minScale={minScale}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-lg border border-foreground/10 p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="angle">Angle</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {angle}°
            </span>
          </div>
          <Slider
            id="angle"
            min={0}
            max={360}
            step={1}
            value={[angle]}
            onValueChange={([v]) => setAngle(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="duration">Duration</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {duration.toFixed(1)}s
            </span>
          </div>
          <Slider
            id="duration"
            min={0.5}
            max={8}
            step={0.1}
            value={[duration]}
            onValueChange={([v]) => setDuration(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="frequency">Frequency</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {frequency.toFixed(2)}
            </span>
          </div>
          <Slider
            id="frequency"
            min={0.02}
            max={0.6}
            step={0.01}
            value={[frequency]}
            onValueChange={([v]) => setFrequency(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="minScale">Min scale</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {minScale.toFixed(2)}
            </span>
          </div>
          <Slider
            id="minScale"
            min={0}
            max={0.9}
            step={0.05}
            value={[minScale]}
            onValueChange={([v]) => setMinScale(v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="easing">Easing</Label>
          <Select
            value={easing}
            onValueChange={(v) => setEasing(v as WaveEasing)}
          >
            <SelectTrigger id="easing" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {easings.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="bounce">Bounce</Label>
          <Switch id="bounce" checked={bounce} onCheckedChange={setBounce} />
        </div>

        <div className="col-span-full flex items-center gap-2">
          <Label className="mr-2">Color</Label>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Use color ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className="size-6 rounded-full ring-1 ring-foreground/10 ring-offset-2 ring-offset-background transition-shadow"
              style={{
                backgroundColor: c,
                boxShadow:
                  color === c ? "0 0 0 2px var(--foreground)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
