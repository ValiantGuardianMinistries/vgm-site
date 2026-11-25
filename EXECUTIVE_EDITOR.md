# VGK in the ministry executive editor

The owner can open the discipleship app's unlocked Admin → Guardian Kids tab
to edit this same VGK library. The native VGK studio remains available at /admin.
Existing rows, attachment storage, public visibility rules and approved adult
administrator emails are preserved.

## Authentication and browser requests

The editor uses the browser's existing VGK Cloudflare Access session. It does
not forward the discipleship member cookie, issue service credentials, store
tokens in JavaScript, or turn app/board membership into VGK administrator access.
An owner who has not signed in to VGK opens the existing VGK /admin sign-in in a
new tab, completes the normal approved-adult flow, then reconnects the editor.

Only the exact HTTPS origin https://discipleship.valiantguardianministries.org
receives credentialed CORS permission on the content and upload endpoints.
Preflight permits GET/POST as applicable and Content-Type only. It returns no
content and grants no authentication. Every actual administrative read, save
and upload still passes the existing signed Access JWT and email-allowlist
verification. Other origins cannot mutate these endpoints. Public reads retain
their existing published/Coming Soon behavior.

The integration assumes the documented Access application protects /admin and
its subpaths, with the API independently verifying the signed session cookie.
If Access is later expanded to cover API paths, configure its OPTIONS behavior
as described in Cloudflare's CORS documentation; do not bypass authentication
for actual requests or weaken browser cookie settings as a workaround.

Reference:
https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/cors/

## Editing and files

The executive form supports existing audience, era, age, parent-involvement,
resource type and visibility fields, plus the current weekly/story/review writing
templates. Printable and episode attachment requirements and 25 MB upload
validation remain enforced in VGK. Private attachment previews open on the VGK
origin using its existing admin authorization.

Executive saves include the loaded updatedAt value. A changed resource rejects
the stale save with 409 instead of overwriting another edit. Reload the library
and select the current resource before retrying. Native studio request behavior
is preserved. No example material is published by this integration.

## Verification and rollout

Run npm run check, npm test and npm run build. API tests cover credentialed
reads, existing authorization, allowed origins, file validation and stale saves.
Signed JWT tests continue to cover issuer, audience, expiry, signature and
approved email. Additional tests cover preflight restrictions and CORS headers.

Deploy this VGK change from the vgk-cloudflare branch before the app editor.
The main website uses the repository's main branch; do not merge VGK code there.
After both deployments, an approved owner should sign in and test loading the
existing drafts, saving a temporary draft, attaching a permitted file and
publishing only intentional content. Verify an unapproved account is denied.
Authenticated production checks require an approved VGK session and cannot be
inferred from a successful build or an anonymous preflight alone.
