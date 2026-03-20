# vgm-site

Static website for **Valiant Guardian Ministries**.

No framework, no build step, no CMS.

## Site Structure

| File | Page |
|---|---|
| `index.html` | The Haven (home) |
| `offering.html` | Offering / Donations |
| `oath.html` | About, Contact, Podcast |
| `forge.html` | Forge room gateway (card-based reveal interaction) |
| `forge-videos.html` | Video lessons hub |
| `videos-vgm.html` | VGM Series lessons |
| `videos-theology.html` | Theology lessons |
| `videos-jv.html` | Jesus vs. lessons |
| `forge-articles.html` | Articles |
| `forge-devotionals.html` | Devotionals |
| `articles-devotional-001.html` | Article/devotional template |
| `training-ground.html` | Kids ministry |
| `armory.html` | Merch (coming soon) |
| `styles.css` | Shared styling system for all pages |

## Local Preview (Live Server)

### Option 1: Python (built in)

```bash
cd vgm-site
python3 -m http.server 8080
```

Open: `http://localhost:8080`

### Option 2: Node live-server (auto reload)

```bash
cd vgm-site
npx live-server --port=8080
```

Open: `http://localhost:8080`

### Mobile Preview on Same Wi-Fi

1. Start one of the local servers above.
2. Find your computer IP:
   ```bash
   ipconfig getifaddr en0
   ```
3. On your phone, open:
   `http://YOUR_IP:8080`

Use `http://` explicitly for local preview.

## Maintenance Guide (Client-Friendly)

### Edit written content

1. Open the page file in a text editor.
2. Change only the text between HTML tags.
3. Do not change embed URLs unless replacing a video/podcast/donation destination intentionally.

### Add a new video lesson

1. Open one of:
   - `videos-vgm.html`
   - `videos-theology.html`
   - `videos-jv.html`
2. Duplicate an existing lesson `<section class="card">...</section>` block on that page.
2. Replace only:
   - lesson title text
   - lesson description text
   - YouTube `iframe src`
   - YouTube watch link `href` (if present)

### Add a new page link to nav

1. Copy an existing nav link in `<nav class="site-nav">`.
2. Paste it in the same nav block.
3. Update `href` and label text.

### Adjust visual style site-wide

Edit `styles.css`:

- Colors: `:root` variables near the top (`--surface`, `--text`, `--muted`, etc.)
- Card styling: `.card`
- Buttons/nav pills: `.site-nav a`, `.pill`, `.btn`
- Mobile behavior: `@media (max-width: 980px)`

## Security and Best Practices

Current in-repo best practices already applied:

- External links opened in a new tab use `rel="noopener noreferrer"`.
- Embedded media uses `loading="lazy"` where applicable.
- Forms submit to Formspree over HTTPS.
- Donation widget and embeds load over HTTPS.
- Shared CSS keeps markup simpler and reduces maintenance errors.

Recommended for deployment (Cloudflare Pages or any production host):

1. Force HTTPS.
2. Add response headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
3. Add a Content Security Policy that explicitly allows:
   - Donorbox (`donorbox.org`)
   - YouTube (`youtube.com`, `youtube-nocookie.com`, `ytimg.com`)
   - Spotify (`open.spotify.com`)
   - Formspree (`formspree.io`)
   - Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
4. Keep dependencies minimal (this repo is already static-only).
5. Review external links and embeds periodically.
