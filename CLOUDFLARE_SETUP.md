# Publish Valiant Guardian Kids

This is the existing VGK website, adapted for your own Cloudflare account. Its artwork, destination pages, compact resource grid, weekly devotional template, and publishing tools are included. Public visitors do not sign in. Only approved adult administrators sign in through Cloudflare Access.

The migration has not been deployed. Keep the current Training Ground link until the new address passes the checks below. The current private VGK site remains available while this is prepared.

## 1. Use the prepared VGK branch in GitHub

The standalone source is in the `vgk-cloudflare` branch of `ValiantGuardianMinistries/vgm-site`. The existing main website stays on `main`. This VGK branch has its own root-level package.json, Vite configuration, artwork, and deployment settings.

Create a separate Cloudflare Worker for VGK. Connect the existing `vgm-site` repository, choose the **vgk-cloudflare** branch, and use project root `/`. Do not change the existing `vgm-site` Cloudflare project or its branch.

The source ZIP is an additional backup of this standalone project. The private content backup must stay outside GitHub.

## 2. Create VGK storage in your Cloudflare dashboard

- D1 database: `vgk-content`. Copy its real database ID.
- R2 bucket: `vgk-media`. Keep it private; do not enable public R2 access. The app serves files only when their resource is published, or to an authenticated admin.
- Stop if Cloudflare asks to activate a paid plan or a new billing commitment. No paid activation is part of this code preparation.

If using a terminal with Node 22.13 or newer, authenticate to your own account and install the locked dependencies:

```sh
npm ci
npx wrangler login
```

The resources can also be created with these commands while signed in:

```sh
npx wrangler d1 create vgk-content
npx wrangler r2 bucket create vgk-media
```

## 3. Protect only the adult admin page with Cloudflare Access

In Cloudflare Zero Trust, create a self-hosted Access application for `kids.valiantguardianministries.org/admin` and its subpaths. Choose your team domain. Use an allow policy containing only your approved adult administrator email addresses. An email one-time PIN is sufficient; public visitors need no account. Do not apply Access to the entire kids website.

Copy the application's Audience (AUD) value. The code verifies Access signatures, issuer, audience, expiration, and the email allowlist on every privileged API call. A request claiming an email address is not sufficient. Same-origin API calls use the signed `CF_Authorization` session cookie after admin sign-in.

## 4. Fill in deployment settings

Edit `wrangler.jsonc`, replacing the placeholder database ID, team domain, audience, and approved admin email addresses. These values are configuration, not API credentials. Never put a Cloudflare API token or password in the repository.

Or run the configuration helper with your real values:

```sh
npm run configure -- --database-id YOUR_D1_UUID --team-domain https://YOUR-TEAM.cloudflareaccess.com --audience YOUR_ACCESS_AUD --admin-emails YOUR_ADMIN_EMAIL --domain kids.valiantguardianministries.org
```

The custom domain uses your existing VGM zone. The helper does not create a new domain or buy anything. It adds a custom-domain route for the new Worker. Keep Access's admin application host in sync with this domain.

Commit the configuration to the `vgk-cloudflare` branch. The deploy script refuses the shipped placeholder configuration and refuses a stale build made before configuration was changed.

## 5. Initialize content and publish

```sh
npm run db:migrate
node scripts/restore-content.mjs /PATH/TO/VGK_Content_Backup --remote
npm run check
npm test
npm run build
npm run deploy
```

The separate backup contains a dated snapshot of all seven existing content records, including the two drafts, plus the existing Space Guardian printable. Extract it outside the repository. The restore checks that required media exists, uploads media to the private bucket, then imports rows. It does not overwrite existing database IDs. If you edit the old site after the snapshot, take a fresh backup before cutting over.

For automatic updates, connect `ValiantGuardianMinistries/vgm-site` to a new Cloudflare Workers Builds project. Use the `vgk-cloudflare` branch, project root `/`, build command `npm run build`, and deploy command `npm run deploy`. Initialize D1 and import the backup once before opening the site to families. Do not add the private backup to GitHub.

## 6. Verify before switching Training Ground

- In a signed-out or incognito browser, the home page, age destinations, and public library open without ChatGPT or other login.
- The Space Guardian printable loads and opens; compare the migrated records with the snapshot.
- Draft and Locked resources never appear in the public list, and their files cannot be opened publicly.
- Coming Soon shows a preview without private body text or attachments.
- `/admin` requires an approved adult sign-in. A different account cannot publish or view statistics.
- An admin can save a draft, preview its attachment, and publish it. Public visitors can then see it.
- A weekly devotional stays one numbered resource with all seven daily parts.
- The footer returns visitors to `https://valiantguardianministries.org/`.

Only after these pass, change the main website's Training Ground links to `https://kids.valiantguardianministries.org/`. We can make that GitHub change without signing in to Cloudflare through this chat.

## Operations

The application creates no child accounts, messages, public uploads, or individual child analytics histories. Cloudflare may process technical request data under its own policies. Confirm your final privacy and parent information before broad release. No payment, email marketing, AI service, or merchandise preorder is enabled by this migration.

Keep D1 exports and private R2 backups outside the GitHub repository. Do not remove the private source site until the new site and its backups have been verified.
