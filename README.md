# VGM Site Documentation Hub

This repository contains the **Valiant Guardian Ministries** static website (`.html`, `.css`, `.js`, images) plus a lightweight Markdown content build for Forge Articles and Forge Devotionals.

There is still no framework or CMS. Most pages remain direct static files, and the Articles/Devotionals sections are generated from repo-based Markdown during the build.

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
npm install
npm run build
# preview at http://localhost:8080
python3 -m http.server 8080
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

- Static site source files live in repo root.
- Markdown content lives in `content/articles/` and `content/devotionals/`.
- `npm run build` updates the generated Articles/Devotionals pages directly in the site root.
- `wrangler.jsonc` serves assets from `"directory": "."`.
- Default branch appears to be `main`.

Dashboard checks still required:

- Confirm Cloudflare production branch.
- Confirm active live-hosting source (Cloudflare vs GitHub Pages).
- Confirm connected custom domains.

## Adding Forge Content

### Add a New Article

1. Create a new Markdown file in `content/articles/`.
2. Add frontmatter:

```yaml
---
title: "Example Article Title"
date: "2026-05-13"
author: "Valiant Guardian Ministries"
description: "Short summary for cards and SEO."
youtube: "https://www.youtube.com/watch?v=example"
slug: "example-article-title"
featured: false
---
```

3. Write the body in normal Markdown below the frontmatter.
4. Run `npm run build`.
5. Preview from the site root.

Articles are listed alphabetically by title.

### Add a New Devotional

1. Create a new Markdown file in `content/devotionals/`.
2. Add frontmatter:

```yaml
---
title: "Genesis 1"
date: "2026-05-13"
author: "Valiant Guardian Ministries"
description: "Short summary for cards and SEO."
youtube: "https://www.youtube.com/watch?v=example"
slug: "genesis-1"
featured: false
category: "Law"
book: "Genesis"
chapter: 1
---
```

3. Write the devotional body in Markdown.
4. Run `npm run build`.
5. Preview from the site root.

Devotionals are organized on the site as `Category -> Book -> Chapter`.

Valid devotional categories:

- `Law`
- `History`
- `Wisdom`
- `Prophets`
- `Gospels`
- `Epistles`

### Add a YouTube Video

- Put the YouTube URL in frontmatter using `youtube:`.
- Supported formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
- If `youtube` is omitted, the build also checks the Markdown body for the first supported YouTube link and embeds it automatically.
- When a valid YouTube link is embedded, the pasted standalone link is removed from the article/devotional body output.

### Required vs Optional Frontmatter

Required for articles:

- `title`
- `slug`

Required for devotionals:

- `title`
- `slug`
- `category`
- `book`
- `chapter`

Optional for both:

- `date`
- `author`
- `description`
- `youtube`
- `featured`

Fallback behavior:

- missing `author` defaults to `Valiant Guardian Ministries`
- missing `description` uses a short excerpt from the Markdown body
- missing `date` does not stop the build, but the build logs a warning

## Cloudflare Pages Settings

If Cloudflare Pages is building directly from GitHub, use:

- Build command: `npm run build`
- Output directory: `.`

This keeps the rest of the site static while allowing Articles and Devotionals to be generated automatically from Markdown commits.

## Future Admin Portal Direction

A future authenticated admin portal can stay lightweight by writing Markdown files into `content/articles/` or `content/devotionals/` and committing them through the GitHub API. Cloudflare Pages can then rebuild the site automatically using the same content pipeline.
