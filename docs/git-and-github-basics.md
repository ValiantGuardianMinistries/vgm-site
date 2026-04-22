# Git and GitHub Basics

Use this as a quick reference. For the step-by-step workflow, use [Getting Started](getting-started.md).

## Key Terms

- `repo`: the project and its history.
- `branch`: your isolated work line.
- `commit`: saved change checkpoint.
- `pull request (PR)`: request to merge branch into `main`.
- `merge`: PR accepted into target branch.

## Core Rule

For normal work, do not commit directly to `main`.

## Daily Command Flow

```bash
git switch main
git pull origin main
git switch -c content/short-description
# edit files
git add .
git commit -m "Describe the change"
git push -u origin content/short-description
```

Then open a PR to `main`, review preview/checks, and merge in GitHub.

## Useful Status Commands

```bash
git status -sb
git branch --show-current
git fetch --all --prune
git branch -vv
```

## Commit Message Pattern

Use clear messages:

- `Fix broken Forge page link`
- `Update donation copy on offering page`
- `Adjust mobile spacing on home page`

Avoid vague messages like `update` or `changes`.

## Merge Conflicts (Simple)

Conflicts happen when two branches edit the same lines.

If this happens:

1. Pause and read conflict markers carefully.
2. Keep only the intended final content.
3. Ask for help before force-pushing if uncertain.
