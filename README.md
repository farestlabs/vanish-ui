# Vanish UI

UI techniques reverse-engineered from real shipped products, rebuilt as installable React components — copy-paste or `npx shadcn add`.

[Live site](https://vanish-ui.vercel.app)

## Components

- **[Threshold Globe](https://vanish-ui.vercel.app)** — Cloudflare's login-page dot-globe, reverse-engineered from the shipped bundle. [Deep dive](https://farestlabs.github.io/threshold-globe/) · `npx shadcn add farestlabs/vanish-ui/threshold-globe`

## Development

```bash
bun install
bun run dev
```

## Adding a component to the registry

1. Add the component under `components/` (and any hook under `hooks/`), using `@/`-alias imports so the shadcn CLI can rewrite them for consumers
2. Add an entry to `registry.json`
3. `bunx shadcn build` — regenerates `public/r/*.json`

## Stack

Next.js · React · Tailwind CSS v4 · shadcn/ui · Biome
