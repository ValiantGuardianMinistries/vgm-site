# Deployment Workflow

This is the practical path from edit to live website.

## First: Confirm Production Branch

Before making changes, verify production branch in Cloudflare deployment settings.

Also check GitHub default branch.

If they differ, treat Cloudflare production-branch setting as deployment source of truth.

## Safe Update Workflow (Recommended)

1. Switch to production branch locally.
2. Pull latest updates.
3. Create a new branch.
4. Make small edits.
5. Preview locally.
6. Commit changes.
7. Push branch.
8. Open Pull Request.
9. Review preview deployment URL.
10. Merge PR only after preview looks correct.
11. Confirm production deploy success.

## Safe Update Commands

```bash
git switch main
git pull origin main
git switch -c content/update-oath-copy
# edit files
python3 -m http.server 8080
# preview at http://localhost:8080
git add .
git commit -m "Update Oath page mission copy"
git push -u origin content/update-oath-copy
```

Then open PR in GitHub and review Cloudflare preview.

## Bigger Change Workflow

Use this for multi-page or major style updates.

1. Create a dedicated branch (`design/...` or `feature/...`).
2. Break work into logical commits.
3. Open PR early as Draft.
4. Request feedback from reviewer(s) with preview link.
5. Keep changes scoped (avoid unrelated edits).
6. Merge only after final review and deploy check.

## How to Know Deploy Succeeded

Check both:

1. GitHub PR checks/status (if configured).
2. Cloudflare deployment status for the commit.

Success signs:

- status is `Success`/green
- timestamp is recent
- preview/live URL loads updated content

## If Deploy Failed: Where to Look

Open Cloudflare deployment details for failed commit and review logs.

Look for messages about:

- missing entry file
- missing assets directory
- config mismatch
- temporary platform failures

## Retry vs Restore/Rollback

### Retry when

- error appears transient/platform-related
- no code changes needed
- Cloudflare status page indicates incident

### Fix and redeploy when

- logs show a clear config/file issue
- branch was outdated
- a bad commit introduced the failure

### Restore/Rollback means

Move production back to last known-good version.

Practical ways:

1. Redeploy the last successful deployment (if UI button exists).
2. Revert the bad commit in GitHub, then merge that revert PR.

Use rollback when production is broken and fast recovery is needed.

## When to Pause and Ask for Help

Pause if any of these happen:

- unsure which branch is production
- unsure whether DNS or deploy issue is root cause
- conflicts appear and you are not sure what to keep
- deploy failed twice with unclear logs
- site is live-broken and impact is visible to users
