# vgm-site

Static website for **Valiant Guardian Ministries** — a discipleship ministry focused on Scripture, virtue, and faithful formation.

Published via GitHub Pages.

## Pages

| File | Page |
|---|---|
| `index.html` | The Haven (home) |
| `offering.html` | Offering / Donations |
| `oath.html` | About, Contact, Podcast |
| `forge.html` | Teaching hub |
| `forge-videos.html` | Video lessons |
| `forge-articles.html` | Articles |
| `forge-devotionals.html` | Devotionals |
| `training-ground.html` | Kids ministry |
| `armory.html` | Merch (coming soon) |

## Preview Locally

No build step needed. Just serve the files with Python:

```bash
cd vgm-site
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Preview on Mobile

As long as your phone and computer are on the same Wi-Fi network:

1. Find your local IP:
   ```bash
   ipconfig getifaddr en0
   ```
2. On your phone's browser, go to `http://YOUR_IP:8080`
   - Use `http://` explicitly — not `https://`
   - If Safari auto-upgrades to HTTPS, try Chrome on your phone instead
