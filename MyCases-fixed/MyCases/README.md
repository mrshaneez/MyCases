# The Casebook

A private research tool for a sitting judge's own body of judgments. Import them
as Word files, search them, check a draft against your earlier reasoning, and see
how your treatment of a proposition has moved over time.

Everything is stored in your browser. There is no server holding your judgments.

## Running it locally

```bash
npm install
npm run dev
```

Open the address it prints. This is the simplest way to use it, and the only way
your judgments never touch a public URL at all.

```bash
npm run build     # writes to dist/
npm run preview   # serves dist/ locally to check it
```

## Deploying with Vercel

Vercel detects Vite on its own. Framework preset **Vite**, build command
`npm run build`, output directory `dist`. Push to `main` and it redeploys.

`vite.config.js` sets `base: "./"`, so the build also works from a subfolder or
straight off the filesystem if you ever want that.

## Before you deploy: read this part

**A deployed site is public by default.** Anyone with the URL can open it, with
no login. Vercel offers Deployment Protection under project settings — turning it
on puts the site behind your own account, which is worth doing for this.

**Your judgments are not published.** They live in this browser's IndexedDB on
the machine you use, not in the repository and not on the host. Deploying
publishes the application, not your casebook.

**Do not commit judgments or backups.** `.gitignore` excludes `*.docx`, `*.doc`
and `casebook-*.json` for that reason. Check `git status` before you commit.

**The API key is yours and lives in your browser.** Paste it under Settings. It
is stored in `localStorage` and sent directly to Anthropic. Never put a key in
the source, in a build-time environment variable, or in a Vercel environment
variable read by the build — a key baked into a static site is readable by
anyone who visits it.

**Drafts leave your machine when you use the model features.** Ask and
Consistency send passages from judgments you have already delivered. Before I
decide and Challenge my reasoning send the text of the draft itself. For a
reserved judgment that is a decision to take deliberately. Filing, search,
filters, authorities and patterns all work with no key and no requests at all.

## What is in here

| File | What it does |
| --- | --- |
| `App.jsx` | The entire application |
| `main.jsx` | Mounts it |
| `storage.js` | IndexedDB store — judgments, full texts, search index |
| `api.js` | Anthropic client using your key |
| `index.html` | Page shell |
| `vite.config.js` | Build config |

The two Dhivehi typefaces, MV Aaamu FK and Faruma, are embedded in `App.jsx` as
woff2 so the app renders Thaana on any device. Check you are entitled to
redistribute them before making the repository public.

## Backing up

Home → **Back up everything** writes a JSON file containing every judgment, its
full text, the search index and your tracked propositions. **Restore a backup**
reads it back. This is the only copy that leaves the browser, and the only way
to move the casebook to another machine.

Clearing site data for this origin erases the casebook. Keep the original Word
files as your record.
