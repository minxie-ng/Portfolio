# Portfolio Site

Next.js app for Min Xie's portfolio.

## Live site

```text
https://portfolio-sable-one-85.vercel.app
```

Avoid sharing the broken nested Vercel hostname:

```text
https://minxie.ng.vercelapp.com
```

## Local development

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build and lint

```bash
npm run build
npm run lint
```

## Deployment

This app is inside the repo's `site/` directory.

In Vercel, set:

```text
Root Directory: site
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm ci
```

## Public safety reminder

Everything under `public/` is publicly served and downloadable.

Before pushing media or external links, check:

- personal photos/videos are okay to publish
- project demos reveal no private data
- Google Docs/Figma links have intentional sharing permissions
- no `.env*`, API keys, tokens, credentials, or private school/client material are committed

See repo-level `docs/public-content-checklist.md`.
