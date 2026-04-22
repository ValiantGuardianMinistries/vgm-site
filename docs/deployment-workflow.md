# Deployment Workflow

Use this checklist after you push your branch and open a PR.

## 1. Confirm Source Branches

Before merge:

- PR base branch should be `main` (or your production branch).
- PR compare branch should be your feature/content branch.

If Cloudflare production branch differs from GitHub default branch, treat Cloudflare as deployment source of truth.

## 2. Review PR Before Merge

In GitHub PR:

1. Review the changed files tab.
2. Confirm the preview deployment URL looks correct.
3. Confirm checks are green.
4. Confirm required approvals are complete.

## 3. Merge In GitHub

1. Click merge action (`Squash and merge` unless your team uses another method).
2. Confirm merge into `main`.
3. Delete the remote branch after merge.

## 4. Verify Production Deploy

Check Cloudflare deployment history for the merged commit.

Success signals:

- deployment status is green/success
- timestamp matches your recent merge
- live URL shows the expected update

## 5. If Deploy Fails

1. Open the failed deployment logs in Cloudflare.
2. Identify whether issue is config/path/content.
3. Push a small fix in a new branch + PR.
4. If production is broken, revert the bad commit via PR.

## Minimal Command Reference

```bash
git switch main
git pull origin main
git switch -c content/short-description
# edit files
python3 -m http.server 8080
git add .
git commit -m "Describe the change"
git push -u origin content/short-description
```
