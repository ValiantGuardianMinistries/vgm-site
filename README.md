# Valiant Guardian Kids

Standalone Cloudflare Workers edition of the existing VGK website.

This project lives on the `vgk-cloudflare` branch of `ValiantGuardianMinistries/vgm-site`. The main VGM website stays on `main`. Connect this branch to a separate Cloudflare Worker.

Start with [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md). This source is prepared and locally checked; it is not a claim that a Cloudflare deployment or custom domain is already live.

- Public browsing without visitor accounts or ChatGPT sign-in.
- Cloudflare Access admin authentication with signed JWT verification and an adult email allowlist.
- D1 content storage and aggregate analytics; private R2 attachments.
- Hidden drafts and Locked resources; metadata-only Coming Soon previews.
- Compact resource grid and complete weekly devotional templates.

```sh
npm ci
npm run check
npm test
npm run build
```

Deployment requires your real account configuration. Placeholder values intentionally prevent `npm run deploy` from publishing an unconfigured application. Keep the separate content backup private and outside this repository.
