# AI Help Prompts (Copy/Paste)

Use these prompts in ChatGPT or Claude when you need support.

Tip: Replace placeholders like `[branch-name]`, `[error text]`, `[PR link]` with your real values.

## Prompt Template Rules

You can prepend this line to almost any prompt:

> Inspect the repository context first, explain what you found, and suggest the safest minimal fix before any risky action.

## 1) Understand a Cloudflare Build Error

```text
Inspect the repository context first. I have a Cloudflare deployment/build error.

Error text:
[PASTE ERROR]

Please:
1) Explain in plain language what this likely means.
2) List the top 3 likely causes for this repo specifically.
3) Give safe, minimal steps to fix it.
4) Tell me what to check in Cloudflare logs and in GitHub.
5) Avoid risky/destructive commands unless absolutely necessary.
```

## 2) Ask What a GitHub Branch Means

```text
Inspect the repository context first and explain this like I am a beginner.

Branch name: [branch-name]
I am currently on: [current-branch]
Production branch might be: [branch-name-or-unknown]

Please explain:
1) What this branch is likely for.
2) Whether it seems safe to keep working here.
3) Whether I should open a PR or switch branches first.
4) Exact safe commands to use next.
```

## 3) Figure Out Why Preview Deployment Did Not Happen

```text
Inspect the repository context first. My PR preview deployment did not appear.

Details:
- Branch: [branch-name]
- PR: [PR link or number]
- Last commit: [commit hash]

Please:
1) Give a step-by-step checklist from GitHub push to Cloudflare preview.
2) Identify likely breakpoints.
3) Suggest minimal, safe fixes first.
4) Tell me when to wait vs when to retry.
```

## 4) Ask How to Safely Undo a Recent Change

```text
Inspect the repository context first. I want to undo a recent change safely.

Details:
- Branch: [branch-name]
- Was it merged to production? [yes/no/not sure]
- Commit hash (if known): [hash]

Please:
1) Recommend the safest undo method.
2) Explain options for uncommitted, committed-not-merged, and merged-to-production cases.
3) Give exact commands with warnings before risky steps.
4) Prefer revert-based approaches over destructive history rewrites.
```

## 5) Ask What a Commit Changed

```text
Inspect the repository context first. Explain this commit in plain language:

Commit: [hash]

Please:
1) Summarize what files changed.
2) Explain user-visible impact.
3) Note any potential risks.
4) Tell me whether this looks safe to merge.
```

## 6) Ask Whether a Branch Is Safe to Merge

```text
Inspect the repository context first. I want to know if this branch is safe to merge.

Branch: [branch-name]
PR: [link]

Please:
1) Check what changed and summarize it in plain language.
2) Highlight possible regressions or broken links/assets.
3) Give a short pre-merge checklist.
4) Give a clear recommendation: merge now, or fix first.
```

## 7) Ask How to Troubleshoot DNS/Domain Issues

```text
Inspect the repository context first. I am troubleshooting a domain/DNS issue.

Symptoms:
[describe issue]

Please:
1) Explain whether this sounds like DNS, deploy, or cache.
2) Tell me what to check in Namecheap vs Cloudflare.
3) Give safe verification steps in order.
4) Tell me what changes should be avoided until confirmed.
```

## 8) Ask How to Inspect a PR Before Approving

```text
Inspect the repository context first. I need to review this PR safely before approval.

PR: [link]

Please:
1) Summarize what changed in beginner-friendly language.
2) Suggest what to test in preview URL.
3) Flag any risky changes or missing checks.
4) Provide an approve / request changes recommendation with reasons.
```

## Optional Add-On Line for Extra Safety

Add this sentence at the end of any prompt:

> If there is uncertainty, stop and ask me a clarifying question before suggesting destructive or high-risk commands.
