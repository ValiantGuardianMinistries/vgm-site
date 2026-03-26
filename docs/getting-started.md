# Getting Started

This guide is for first-time contributors who want to make safe updates.

## What This Project Is

- Static website (HTML/CSS/JS/images)
- No framework setup required
- No `npm install` step required for normal content/style updates

## 1. Get the Repository

### Option A: Clone with Git (recommended)

```bash
git clone https://github.com/ValiantGuardianMinistries/vgm-site.git
cd vgm-site
```

### Option B: Download ZIP (no Git tools needed)

1. Open the repository on GitHub.
2. Click **Code**.
3. Click **Download ZIP**.
4. Unzip to a folder on your computer.

If you use ZIP download, you cannot push changes back with Git until you later set up Git.

## 2. Open the Project Locally

Use any code editor (for example, VS Code). Open the `vgm-site` folder.

## 3. Preview the Site Locally

From inside the repo folder:

```bash
python3 -m http.server 8080
```

Then open:

- `http://localhost:8080`

To stop the server, return to terminal and press `Ctrl + C`.

## 4. Know Which Branch You Are On

```bash
git branch --show-current
```

or

```bash
git status -sb
```

## 5. Switch Branches

```bash
git switch main
```

If your team uses a different production branch, replace `main` with that branch name.

## 6. Pull Latest Changes Before You Edit

```bash
git pull origin main
```

(Use your production branch name if not `main`.)

## 7. Create a Safe Working Branch

Use a short, descriptive name:

```bash
git switch -c content/update-homepage-copy
```

Examples:

- `content/fix-spelling-oath-page`
- `design/update-forge-layout`
- `bugfix/fix-broken-link-training`

## 8. Preview HTML/Static Changes Locally

After edits:

1. Refresh `http://localhost:8080` in your browser.
2. Open the exact page you changed (`forge.html`, `oath.html`, etc.).
3. Check mobile width using browser responsive mode.
4. Confirm links and images still work.

## 9. Basic Save-and-Ship Commands

```bash
git add .
git commit -m "Update homepage intro copy"
git push -u origin content/update-homepage-copy
```

Then open a Pull Request in GitHub.

## If Something Feels Off

- Do not force-push unless someone confirms it is safe.
- Do not delete branches in panic.
- Pause and ask for help with:
  - current branch name
  - what command you just ran
  - screenshot/text of the error
