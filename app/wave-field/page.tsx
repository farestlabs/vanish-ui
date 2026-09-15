import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyInstallCommand } from "../copy-install-command";
import { WaveFieldPlayground } from "./wave-field-playground";

export const metadata: Metadata = {
  title: "Wave Field · Vanish UI",
  description:
    "A deterministic traveling wave, sweeping a value across space and time — tune it live and read exactly how it works.",
};

const codeText = `function waveField(x, y, timeMs, options) {
  const { angle, duration, frequency, easing, bounce, min, max } = options;

  const direction = (angle * Math.PI) / 180;
  const travel = x * Math.cos(direction) + y * Math.sin(direction);

  const rawPhase = ((timeMs / 1000 / duration + travel * frequency) % 1) + 1;
  const phase = rawPhase % 1;

  const t = bounce ? 1 - Math.abs(phase * 2 - 1) : phase;
  const eased = easings[easing](t);

  return min + (max - min) * eased;
}`;

export default function WaveFieldPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Vanish UI
        </Link>
        <h1 className="font-heading text-3xl font-medium text-balance sm:text-4xl">
          Wave Field
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          A deterministic wave sweeps across a grid in any direction you choose,
          turning each cell's position into a phase in the wave. No per-cell
          state, no randomness — just position, time, and a direction vector.
        </p>
      </header>

      <section>
        <WaveFieldPlayground />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-xl font-medium">How it works</h2>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              1. Project the cell onto the wave's direction.
            </strong>{" "}
            <code className="rounded bg-foreground/5 px-1 py-0.5 font-mono text-[0.85em] text-foreground">
              angle
            </code>{" "}
            gives a unit vector. Dotting each cell's{" "}
            <code className="font-mono">(x, y)</code> against it collapses the
            2D grid into a single number,{" "}
            <code className="font-mono">travel</code> — how far along the wave's
            direction that cell sits, regardless of the grid's actual shape.
          </p>

          <p>
            <strong className="text-foreground">
              2. Turn time + position into a phase.
            </strong>{" "}
            The wave's phase at a cell is{" "}
            <code className="font-mono">time / duration</code> (how far through
            one cycle the clock has gotten) plus{" "}
            <code className="font-mono">travel × frequency</code> (how far ahead
            or behind that cell is in space). Taken mod 1, this is what makes
            the wave visibly move: cells further along the direction vector hit
            the same phase later.
          </p>

          <p>
            <strong className="text-foreground">
              3. Shape the phase, don't just use it.
            </strong>{" "}
            A raw phase is a sawtooth — snaps back to 0 every cycle.{" "}
            <code className="font-mono">bounce</code> folds it into a triangle
            wave (0→1→0) instead. Either way, the result still passes through an
            easing curve (<code className="font-mono">linear</code>,{" "}
            <code className="font-mono">smooth</code> = smoothstep,{" "}
            <code className="font-mono">inOut</code> = cubic,{" "}
            <code className="font-mono">elastic</code> = overshoot) before it's
            remapped to <code className="font-mono">[min, max]</code>.
          </p>

          <p>
            The function itself doesn't know about DOM nodes, canvases, or React
            — it just maps{" "}
            <code className="font-mono">(x, y, time) → number</code>.{" "}
            <code className="font-mono">useWaveField</code> is the thin React
            layer that calls it every animation frame for a grid of cells;
            nothing stops you from feeding the same function into a canvas
            render loop or a WebGL uniform instead.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-foreground/10">
          <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2 font-mono text-xs text-muted-foreground">
            <span>use-wave-field.ts</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">
            {codeText}
          </pre>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-foreground/10 pt-6">
        <p className="text-xs text-muted-foreground">
          Part of{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Vanish UI
          </Link>
        </p>
        <CopyInstallCommand command="npx shadcn add farestlabs/vanish-ui/wave-field" />
      </footer>
    </main>
  );
}
