import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyInstallCommand } from "../copy-install-command";
import { ThresholdGlobePlayground } from "./threshold-globe-playground";

export const metadata: Metadata = {
  title: "Threshold Globe · Vanish UI",
  description:
    "Cloudflare's login-page dot-globe, reverse-engineered from the shipped bundle — tune it live and read exactly how it works.",
};

const codeText = `function hash(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function threshold(cx, cy, t, landAlpha) {
  const wave = (Math.sin(cx * 0.27 + t * 2e-4)
             + Math.sin(cy * 0.19 - t * 1.5e-4) + 2) / 4;
  return 0.05 + landAlpha * (0.42 + wave * 0.28);
}

// draw the cell only if hash(cx, cy) <= threshold(...)`;

export default function ThresholdGlobePage() {
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
          Threshold Globe
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          The animated backdrop on Cloudflare's login page isn't a flat pixel
          world map — it's a low-resolution 3D globe, rotated with real
          orthographic map projection math and rendered as a dithered grid of
          tiny squares. Reverse-engineered from the shipped bundle.
        </p>
      </header>

      <section>
        <ThresholdGlobePlayground />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-xl font-medium">How it works</h2>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">
              1. Project a real globe, but at almost no resolution.
            </strong>{" "}
            The component draws the world (a{" "}
            <code className="font-mono">world-110m</code> TopoJSON) with{" "}
            <code className="font-mono">d3.geoOrthographic()</code> — an actual
            rotating-sphere projection, not a flat map — but onto an offscreen
            canvas sized at <code className="font-mono">width / cellSize</code>.
            At a 6px cell, a 700px-wide globe is projected onto a canvas roughly
            117px wide.
          </p>

          <p>
            <strong className="text-foreground">
              2. Read the tiny render back as land/ocean.
            </strong>{" "}
            Fill the projected landmass white, then read the offscreen canvas's{" "}
            <code className="font-mono">ImageData</code>. Each of those ~117×66
            pixels becomes one cell's land coverage — its alpha channel, 0 for
            ocean, up to 1 for land.
          </p>

          <p>
            <strong className="text-foreground">
              3. Give every cell a fixed, position-only "difficulty".
            </strong>{" "}
            A classic single-line pseudo-random hash — seeded only by the cell's
            x, y, never by time — assigns each cell a fixed number in{" "}
            <code className="font-mono">[0, 1)</code>. This is what makes some
            cells twinkle readily and others almost never: it's baked into their
            position, not re-rolled per frame.
          </p>

          <p>
            <strong className="text-foreground">
              4. Sweep a slow threshold wave over the grid.
            </strong>{" "}
            A cell is drawn only when its fixed hash falls under a threshold —
            and that threshold isn't constant. It's the sum of two sine waves
            running at different speeds along x and y, plus a floor that's much
            higher over land than ocean. As the wave rises and falls, it crosses
            different cells' hash values — that's the shimmer, with zero per-dot
            state to track.
          </p>

          <p>
            <strong className="text-foreground">
              5. Throttle hard, rotate slow, respect the OS setting.
            </strong>{" "}
            The whole thing redraws at roughly 9fps by default, not 60 — that
            chunkiness is deliberate, not a performance ceiling. Longitude
            advances linearly for a full rotation every 30 seconds. If{" "}
            <code className="font-mono">prefers-reduced-motion</code> is set, it
            renders exactly one frame and never schedules another.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-foreground/10">
          <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2 font-mono text-xs text-muted-foreground">
            <span>use-threshold-globe.ts</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">
            {codeText}
          </pre>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-6">
        <p className="text-xs text-muted-foreground">
          Part of{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Vanish UI
          </Link>{" "}
          ·{" "}
          <a
            href="https://farestlabs.github.io/threshold-globe/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Original write-up
          </a>
        </p>
        <CopyInstallCommand command="npx shadcn add farestlabs/vanish-ui/threshold-globe" />
      </footer>
    </main>
  );
}
