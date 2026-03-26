# VGM Site Documentation Hub

This repository contains the **Valiant Guardian Ministries** website.

The site is a **static website** (HTML, CSS, JS, images), which means there is no app framework and no build pipeline in this repo. You edit files directly, preview locally, then deploy through GitHub + Cloudflare workflow.

## Start Here

If you are new to this project, read in this order:

1. [Getting Started](docs/getting-started.md)
2. [Git and GitHub Basics](docs/git-and-github-basics.md)
3. [Deployment Workflow](docs/deployment-workflow.md)
4. [Cloudflare and Domain Overview](docs/cloudflare-and-domain-overview.md)
5. [Troubleshooting](docs/troubleshooting.md)
6. [AI Help Prompts](docs/ai-help-prompts.md)

## What Is Set Up Right Now

From this repository, we can confirm:

- The site is static files (`.html`, `.css`, `.js`, images).
- There is **no** `package.json` and no required npm build step.
- A Cloudflare config file exists: `wrangler.jsonc`.
- `wrangler.jsonc` is configured to serve assets from the repo root (`"assets": { "directory": "." }`).
- The GitHub default branch appears to be `main` (`origin/HEAD -> origin/main`).

Items you should verify in dashboards:

- Which branch is currently set as **production** in Cloudflare.
- Whether GitHub Pages is still active or has been replaced by Cloudflare for live hosting.
- Which exact custom domain(s) are connected in Cloudflare.

## Platform Overview (Simple)

- **GitHub** stores code, branches, commits, and pull requests.
- **Cloudflare** handles deployments and preview/live environments (based on current repo setup and commit history).
- **Namecheap** is typically the domain registrar (where the domain is purchased/renewed).

## Safe Change Flow

Use this sequence for almost all updates:

1. Pull latest changes.
2. Create a new branch.
3. Make small edits.
4. Preview locally.
5. Commit and push.
6. Open Pull Request (PR).
7. Check Cloudflare preview URL.
8. Merge PR to production branch when approved.
9. Confirm production deploy is green.

## Local Preview (No Build Needed)

From the repository folder:

```bash
python3 -m http.server 8080
```

Open:

- `http://localhost:8080`

## Quick Safety Rules

- Do not edit production branch directly for non-trivial changes.
- Keep PRs small and focused.
- Always check preview before merge.
- If deploy fails, do not panic: check logs, fix, and retry.
- If unsure, pause and ask for help before force-pushing or deleting branches.

## Repository Structure (High-Level)

- Root HTML pages: `index.html`, `forge.html`, etc.
- Shared styles: `haven.css`
- Shared JS behavior: `haven.js`
- Static assets/images: JPG/PNG files in repo root
- Cloudflare config: `wrangler.jsonc`
- Documentation: `docs/`
