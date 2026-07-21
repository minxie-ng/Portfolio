# Public Content Checklist

This portfolio repo is public. Anything committed here can be viewed, cloned, and downloaded by strangers.

## Current live URL

Use:

```text
https://portfolio-sable-one-85.vercel.app
```

Avoid sharing:

```text
https://minxie.ng.vercelapp.com
```

That nested `vercelapp.com` hostname has SSL/deployment issues.

## Safe to keep public

These are generally expected in a public portfolio repo:

- source code for the portfolio
- project case-study text
- public project screenshots or demos
- public email/contact links
- public LinkedIn link
- public-facing Figma/Google Docs links, if intentionally shared

## Do not commit

Never commit:

- `.env`, `.env.local`, `.env.production`, or similar files
- API keys
- OAuth access/refresh tokens
- Vercel tokens
- database credentials
- private keys / `.pem` files
- private resumes with phone/address/ID numbers
- school/client/internship confidential material
- raw chat logs or personal exports
- Obsidian vault contents unless intentionally published

## Public media inventory to review

Current media assets under `site/public/` include:

| Path | Risk to review |
|---|---|
| `site/public/me/` | Personal photos/videos are publicly downloadable. Keep only if comfortable. |
| `site/public/projects/cmb/*.gif` | Public project demo GIFs; check they reveal no private info. |
| `site/public/projects/smufoodapp/demo.mp4` | Public demo video; check it reveals no private info. |

## External links to review

Current public pages link to Google/Figma resources:

| Page | External resources |
|---|---|
| CDC project | Google Doc + Figma prototype/embed |
| CMB project | Google Slides deck |

Before sharing the portfolio widely, verify each resource's sharing permissions:

- if it should be public: use viewer-only access
- if not public: replace with a redacted PDF/image or remove the link

## Quick local scan

Run from repo root:

```bash
python3 - <<'PY'
from pathlib import Path
import re
patterns = {
    'secret-like assignment': re.compile(r'(?i)(api[_-]?key|secret|token|password|private[_-]?key|client[_-]?secret)\s*[:=]'),
    'private key block': re.compile(r'BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY'),
    'google token/client': re.compile(r'(?i)(refresh_token|access_token|client_secret|client_id)'),
}
skip = {'.git', 'node_modules', '.next', 'docs'}
for p in Path('.').rglob('*'):
    if not p.is_file() or any(part in skip for part in p.parts):
        continue
    try:
        txt = p.read_text(errors='ignore')
    except Exception:
        continue
    for i, line in enumerate(txt.splitlines(), 1):
        for name, pat in patterns.items():
            if pat.search(line):
                print(f'{p}:{i}: {name}')
PY
```

This is a lightweight scan, not a full security audit.

## Deployment note

The Next.js app lives in `site/`. Vercel should either:

1. set project **Root Directory** to `site`, or
2. deploy using commands from `site/`.

Local verification:

```bash
cd site
npm ci
npm run build
npm run lint
```
