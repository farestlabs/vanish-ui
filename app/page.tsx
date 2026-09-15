import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { ThresholdGlobe } from "@/components/threshold-globe";
import { WaveFieldGrid } from "@/components/wave-field-grid";
import { CopyInstallCommand } from "./copy-install-command";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Vanish UI
          </p>
          <a
            href="https://github.com/farestlabs/vanish-ui"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="View on GitHub"
          >
            <GithubLogo className="size-5" />
          </a>
        </div>
        <h1 className="font-heading text-3xl font-medium text-balance sm:text-4xl">
          UI techniques reverse-engineered from real shipped products.
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Every component here started as "how does that actually work?" — taken
          apart, understood, and rebuilt as real, installable React. Copy-paste
          or{" "}
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
            npx shadcn add
          </code>
          .
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
          <div className="relative aspect-video bg-[#ff5e1f]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff5e1f] to-transparent" />
            <ThresholdGlobe className="absolute inset-0" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 bg-card px-4 py-3">
            <div>
              <p className="font-heading text-sm font-medium">
                Threshold Globe
              </p>
              <p className="text-xs text-muted-foreground">
                Cloudflare's login-page globe — orthographic projection dithered
                to a shimmering grid.{" "}
                <a
                  href="https://farestlabs.github.io/threshold-globe/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Read the deep dive
                </a>
              </p>
            </div>
            <CopyInstallCommand command="npx shadcn add farestlabs/vanish-ui/threshold-globe" />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
          <div className="flex aspect-video items-center justify-center bg-[#0d141c] p-10">
            <WaveFieldGrid
              columns={14}
              rows={7}
              color="#4fe3d1"
              angle={35}
              duration={2.5}
              frequency={0.22}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 bg-card px-4 py-3">
            <div>
              <p className="font-heading text-sm font-medium">Wave Field</p>
              <p className="text-xs text-muted-foreground">
                A grid that pulses as a directional wave sweeps across it —
                angle, easing and bounce are all configurable.
              </p>
            </div>
            <CopyInstallCommand command="npx shadcn add farestlabs/vanish-ui/wave-field" />
          </div>
        </div>
      </section>

      <footer className="mt-auto text-xs text-muted-foreground">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/farest/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Fares Talbi
        </a>
      </footer>
    </main>
  );
}
