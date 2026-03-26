# Troubleshooting Guide

Use this guide when something does not behave as expected.

## Cloudflare Build Failed

What it usually means:

- Cloudflare could not deploy the latest commit.

Likely causes:

- wrong branch settings
- missing file/path expected by config
- temporary Cloudflare issue

Safe checks:

1. Open failed deployment logs in Cloudflare.
2. Confirm branch is the intended one.
3. Confirm expected files exist in repo root.
4. Push a small follow-up fix commit if needed.

When not to panic:

- one-off deploy failures happen.

When to restore/revert:

- if production is broken, revert to last known-good commit/deploy.

When to ask for help:

- logs are unclear after two attempts.

## Missing Entry Point or Assets Directory

What it usually means:

- deploy config points to a file/folder that does not exist.

Likely causes:

- moved/renamed files
- wrong output directory configured

Safe checks:

1. Review `wrangler.jsonc` (`assets.directory` currently `.`).
2. Confirm `index.html` exists at repo root.
3. Confirm static assets were committed and pushed.

When not to panic:

- this is usually a path mismatch, not total project loss.

When to restore/revert:

- if critical file was accidentally removed and quick fix is unclear.

When to ask for help:

- if config and files look right but error persists.

## Preview Did Not Update

What it usually means:

- latest commit did not trigger or did not finish preview deployment.

Likely causes:

- push did not happen
- PR points to different branch
- cache delay

Safe checks:

1. Run `git status -sb` and confirm branch/clean state.
2. Run `git log --oneline -n 3` and confirm latest commit exists locally.
3. Confirm commit exists on GitHub branch.
4. Check Cloudflare deployment list for that commit.
5. Hard refresh preview URL.

When not to panic:

- previews can take a few minutes.

When to restore/revert:

- usually not needed for preview-only issues.

When to ask for help:

- no preview appears after confirmed push and normal wait time.

## Wrong Branch Deployed

What it usually means:

- production branch setting or merge target is incorrect.

Likely causes:

- PR merged into wrong branch
- Cloudflare production branch setting mismatch

Safe checks:

1. Confirm merged PR target branch in GitHub.
2. Confirm production branch in Cloudflare settings.
3. Compare deployed commit hash with expected commit.

When not to panic:

- branch settings can be corrected quickly.

When to restore/revert:

- if wrong code is live, revert wrong merge and deploy intended branch.

When to ask for help:

- if branch strategy is unclear to the team.

## Local Preview Does Not Match Production

What it usually means:

- environment or cache differences are hiding the same code behavior.

Likely causes:

- browser cache
- production on different commit
- stale deployment

Safe checks:

1. Hard refresh local and production pages.
2. Confirm production deployment commit hash.
3. Confirm local branch includes same commit.
4. Test in private/incognito window.

When not to panic:

- cache mismatch is common.

When to restore/revert:

- only if production is confirmed wrong and impact is high.

When to ask for help:

- if commit hashes differ and branch history is confusing.

## Changes Are Not Showing Live

What it usually means:

- merge/deploy/DNS/cache path is not complete yet.

Likely causes:

- PR not merged
- deploy failed silently
- DNS record points elsewhere

Safe checks:

1. Confirm PR merged.
2. Confirm latest production deployment succeeded.
3. Confirm domain DNS points to current host.
4. Wait a few minutes and recheck.

When not to panic:

- propagation/caching delays happen.

When to restore/revert:

- if known bad changes are live and urgent.

When to ask for help:

- if deployment is green but public domain still serves old content long after.

## DNS/Domain Confusion

What it usually means:

- changes were made in the wrong DNS authority.

Likely causes:

- editing Namecheap DNS while Cloudflare is authoritative (or vice versa)
- incorrect nameserver setup

Safe checks:

1. In Namecheap, confirm nameservers.
2. If nameservers are Cloudflare, manage DNS in Cloudflare.
3. Verify A/CNAME records and proxy settings.

When not to panic:

- DNS changes can take time to propagate.

When to restore/revert:

- revert incorrect DNS records if site/mail breaks.

When to ask for help:

- if you are unsure where authoritative DNS currently lives.

## Why Is This Not Deploying?

What it usually means:

- one link in the chain failed: branch -> push -> PR -> deploy.

Safe checks in order:

1. Confirm file changed locally.
2. Confirm commit created.
3. Confirm commit pushed to correct branch.
4. Confirm PR exists and target branch is correct.
5. Confirm Cloudflare saw that commit.
6. Read failed logs if applicable.

## Why Is My PR Preview Not Appearing?

Likely causes:

- Cloudflare project not connected correctly
- branch preview setting disabled
- temporary platform delay

Safe checks:

1. Ensure PR branch exists on GitHub remote.
2. Confirm Cloudflare project is linked to this repo.
3. Check deploy activity by commit hash.
4. Retry with a tiny follow-up commit.

## I Changed Something and Want to Undo It

Safest options:

1. If not committed yet: restore file changes in editor or use Git restore carefully.
2. If committed on your branch: create a new commit that reverts the change.
3. If merged to production: create a revert commit via PR.

Do not panic-delete branches.

Ask for help before using force push if others may have pulled the branch.
