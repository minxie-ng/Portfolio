# Portfolio

Personal portfolio website for Min Xie.

## Live site

Use this URL:

```text
https://portfolio-sable-one-85.vercel.app
```

Do **not** use:

```text
https://minxie.ng.vercelapp.com
```

That nested `vercelapp.com` hostname has SSL/deployment issues and may return errors.

## About Me

I’m an Information Systems student with a strong interest in product and user experience, focused on solving real-world problems through thoughtful, user-centred solutions.

## Featured Projects

- CDC Vouchers UX / Exact Amount Payment Project
- SMU App — Food Pre-Order & Pickup Feature
- CMB Dating App — Product & UX Concept

## Tech Stack

- Next.js
- Tailwind CSS
- Deployed on Vercel

## Local development

The Next.js app lives in `site/`.

```bash
cd site
npm ci
npm run dev
```

## Production build check

```bash
cd site
npm ci
npm run build
npm run lint
```

## Public-content safety

This is a public repository. Treat everything committed here as visible and downloadable by strangers.

Before pushing, check:

- no `.env*` files
- no API keys, OAuth tokens, passwords, private keys, or Vercel tokens
- no private school/client/internship data
- no private documents unless they are intentionally public
- all files in `site/public/` are safe to publish
- Google Docs/Figma links are intentionally shared publicly or appropriately restricted

See [`docs/public-content-checklist.md`](docs/public-content-checklist.md).
