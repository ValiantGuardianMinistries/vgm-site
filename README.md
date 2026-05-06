# VGM Site Documentation Hub

This repository contains the **Valiant Guardian Ministries** static website (`.html`, `.css`, `.js`, images).

There is no framework setup and no npm build pipeline. Edit files directly, preview locally, then ship through GitHub + Cloudflare.

## Read In This Order

1. [Getting Started](docs/getting-started.md) (required)
2. [Deployment Workflow](docs/deployment-workflow.md) (required)
3. [Troubleshooting](docs/troubleshooting.md) (use when blocked)
4. [Cloudflare and Domain Overview](docs/cloudflare-and-domain-overview.md) (hosting + DNS context)
5. [Git and GitHub Basics](docs/git-and-github-basics.md) (optional refresher)
6. [AI Help Prompts](docs/ai-help-prompts.md) (optional helper prompts)

## Quick Contributor Flow

```bash
git switch main
git pull origin main
git switch -c content/short-description
# edit files
python3 -m http.server 8080
# preview at http://localhost:8080
git add .
git commit -m "Describe the change"
git push -u origin content/short-description
```

Then in GitHub:

1. Open a Pull Request into `main`.
2. Review file changes and preview deployment.
3. Merge after approval/checks.
4. Delete the branch in GitHub.

After merge, sync locally:

```bash
git switch main
git pull origin main
git branch -d content/short-description
```

## Current Repo Signals

- Static site files live in repo root.
- `wrangler.jsonc` exists and serves assets from `"directory": "."`.
- Default branch appears to be `main`.

Dashboard checks still required:

- Confirm Cloudflare production branch.
- Confirm active live-hosting source (Cloudflare vs GitHub Pages).
- Confirm connected custom domains.
