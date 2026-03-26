# Cloudflare and Domain Overview

This guide explains who does what across Namecheap, Cloudflare, and GitHub.

## Quick Responsibility Map

- **Namecheap:** Domain registration and renewal (who owns the domain name).
- **Cloudflare:** DNS (in most setups), SSL/security, CDN, and deployments/previews.
- **GitHub:** Source code, branches, commits, pull requests, and collaboration.

## Where You Usually Log In

Log into **Namecheap** when you need to:

- renew the domain
- change account ownership/billing
- check nameserver assignment

Log into **Cloudflare** when you need to:

- manage DNS records (if nameservers point to Cloudflare)
- inspect deployment status and logs
- view preview URLs
- confirm production branch settings

Log into **GitHub** when you need to:

- edit code/content
- push branches
- open/review/merge pull requests
- inspect commit history

## Where Settings Live

### Domain Registration

Typically in Namecheap.

### DNS Records (A, CNAME, etc.)

Usually in Cloudflare **if** domain nameservers were switched to Cloudflare.

If nameservers still point to Namecheap, DNS is still managed in Namecheap.

### Deployments and Build Logs

In Cloudflare dashboard under your project/service deployment history.

### Branches and PR Reviews

In GitHub.

## What We Can Confirm From This Repo

- `wrangler.jsonc` exists and names project `vgm-site`.
- Assets are served from repo root (`"directory": "."`).
- Recent commit history references Cloudflare preview triggering.

## Important Assumption to Verify

This documentation assumes Cloudflare is now the main deployment path.

Because dashboards are not visible in this repo, verify:

1. Cloudflare project/service exists and is connected to this repository.
2. Production branch name in Cloudflare settings.
3. Custom domain mapping in Cloudflare.
4. Whether GitHub Pages is still active (if yes, decide one source of truth).

## How Preview Deployments Work (Simple)

When you push a branch and open a PR:

1. Cloudflare receives the new commit.
2. Cloudflare builds/deploys a preview environment.
3. You get a preview URL tied to that branch/PR.
4. You review safely before production.

Why useful:

- catch issues before live site changes
- let non-technical reviewers approve via URL
- reduce risk of broken production updates

## Free Tier: Practical Expectations

Cloudflare free plans generally allow:

- custom domain usage
- HTTPS/SSL
- global caching/CDN
- branch preview-style workflows (depending on product configuration)

Free tier also has limits (usage and feature limits) that can affect:

- build/deploy frequency
- advanced analytics/security features
- support response options

Plan details change over time, so confirm current limits in Cloudflare pricing/docs before relying on a specific threshold.

## Common Gotchas

- DNS edits made in wrong platform (Namecheap vs Cloudflare).
- Production branch mismatch between GitHub and Cloudflare.
- Old DNS cache making a fix look like it did not work yet.
- Two hosting paths active at once (Cloudflare + GitHub Pages), causing confusion.
- Preview checked on one branch while different branch was merged.
