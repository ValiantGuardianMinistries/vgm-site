# Getting Started

This is the fastest safe path for contributors: sync `main`, branch, edit, preview, push, PR, merge.

## 1. Clone Once

```bash
git clone https://github.com/ValiantGuardianMinistries/vgm-site.git
cd vgm-site
```

## 2. Start Every Task From Latest `main`

```bash
git switch main
git pull origin main
git switch -c content/short-description
```

Branch name examples:

- `content/fix-oath-typo`
- `design/update-home-hero`
- `bugfix/fix-broken-link`

## 3. Edit and Run a Local Server

From the repo folder:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080` and check the exact page you changed.

Stop the server with `Ctrl + C`.

## 4. Commit and Push Your Branch

```bash
git status -sb
git add .
git commit -m "Describe the change"
git push -u origin content/short-description
```

Use small, specific commit messages.

## 5. Open Pull Request In GitHub

1. Open the repo in GitHub.
2. Click `Compare & pull request` for your branch.
3. Confirm base branch is `main`.
4. Add title/description, then create the PR.

## 6. Merge Process In GitHub

1. Review changed files in the PR tab.
2. Confirm preview deployment looks correct.
3. Wait for required checks/review approval.
4. Click `Squash and merge` (or your team merge method).
5. Delete the remote branch after merge.

## 7. Sync Local After Merge

```bash
git switch main
git pull origin main
git branch -d content/short-description
```

## Safety Rules

- Do not commit directly to `main` for normal work.
- Do not force-push unless explicitly approved.
- If you are unsure, pause and ask before risky commands.
