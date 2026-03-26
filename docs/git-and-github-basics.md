# Git and GitHub Basics (Plain Language)

## Core Ideas

- **Repository (repo):** The project folder and its history.
- **Branch:** A safe copy of the project timeline where you make changes.
- **Commit:** A saved checkpoint of your changes with a message.
- **Pull Request (PR):** A request to merge branch changes into production branch.
- **Merge:** Accepting PR changes into the target branch.
- **Production:** The branch/environment currently serving the live public site.

## Why Branches Matter

Branches protect the live website from unfinished edits.

Instead of editing production directly:

1. Create a branch.
2. Make and test changes.
3. Open PR.
4. Review preview deployment.
5. Merge when ready.

This keeps updates safer and easier to review.

## How Preview Deployments Fit In

A preview deployment is a temporary live URL for a branch or PR.

Use it to check:

- layout and content
- links and images
- mobile behavior
- stakeholder approval before production

## What It Means to Merge a PR

Merging a PR means your approved branch changes are now part of the production branch history.

After merge, deployment tools (Cloudflare in this setup) typically publish those changes to live site.

## Practical Workflows

### Small Content Update

Examples: typo fix, paragraph update, link text change.

1. Pull latest production branch.
2. Create branch (`content/...`).
3. Edit one or a few files.
4. Commit with clear message.
5. Push and open PR.
6. Check preview URL.
7. Merge.

### Bigger Visual Update

Examples: multiple page layout or styling changes.

1. Pull latest production branch.
2. Create dedicated branch (`design/...`).
3. Make changes in small checkpoints (several commits).
4. Validate desktop + mobile locally.
5. Push and open PR early (draft is fine).
6. Review preview with stakeholders.
7. Merge only after approval.

## When to Create a New Branch

Create a new branch when:

- starting any new task
- switching to a different task
- work may take more than one session
- work needs review before publish

## When to Avoid Editing Production Directly

Avoid direct production edits for anything beyond an urgent one-line emergency fix.

Even for urgent fixes, create a branch if possible so you keep history clear.

## Commit Message Best Practices

Good commit messages are short and specific.

Use this style:

- `Fix broken Forge page link`
- `Update Offering page donation copy`
- `Adjust mobile spacing on home page`

Avoid vague messages like:

- `changes`
- `update`
- `fix stuff`

## Keep Changes Small and Understandable

- One branch = one purpose.
- One PR = one clear outcome.
- Avoid mixing content edits with unrelated visual rewrites.
- Smaller PRs are easier to review, test, and roll back if needed.

## Ahead/Behind: What It Means

Use:

```bash
git status -sb
git fetch --all --prune
git branch -vv
```

- **Ahead** means your branch has commits not pushed to remote yet.
- **Behind** means remote has commits you do not have locally yet.

## When to Pull Before Editing

Pull before editing when:

- you just switched to production branch
- others may have recently merged PRs
- you resumed work after a break

Command:

```bash
git pull origin main
```

(replace `main` if your production branch differs)

## Merge Conflicts: Why They Happen

Conflicts happen when two branches changed the same lines differently.

How to reduce conflict risk:

- pull latest before branch creation
- keep branches short-lived
- merge frequently
- avoid very large all-in-one PRs

If conflict appears, pause and resolve carefully. Ask for help if uncertain.
