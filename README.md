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

To build a static copy you can open from a folder or host anywhere:

```bash
npm run build     # writes to dist/
npm run preview   # serves dist/ locally to check it
```

## Deploying to GitHub Pages

1. Create the repository and push this folder to `main`.
2. In the repository, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push. The workflow in `.github/workflows/deploy.yml` builds and publishes.

`vite.config.js` sets `base: "./"`, so the build works under `/<repo>/` without
further configuration.

## Before you deploy: read this part

**A GitHub Pages site is public.** Even from a private repository, the published
site is reachable by anyone with the URL and is not protected by a login. The
page carries `noindex`, so search engines should not list it, but that is a
request to crawlers, not access control.

**Your judgments are not published.** They live in this browser's IndexedDB on
the machine you use, not in the repository and not on the host. Publishing the
site publishes the application, not your casebook.

**Do not commit judgments or backups.** `.gitignore` excludes `*.docx`,
`*.doc` and `casebook-*.json` for that reason. Check `git status` before your
first commit.

**The API key is yours and lives in your browser.** Paste it under Settings. It
is stored in `localStorage` and sent directly to Anthropic. It is never written
to the repository. Do not put a key in the source, in an environment variable
used at build time, or in a GitHub secret consumed by the build — a key baked
into a static site is readable by anyone who visits it.

**Drafts leave your machine when you use the model features.** Ask and
Consistency send passages from judgments you have already delivered. Before I
decide and Challenge my reasoning send the text of the draft itself. For a
reserved judgment that is a decision to take deliberately. If you would rather
it never left, run the app locally and use only the parts that do not call the
model — filing, search, filters, authorities and patterns all work without a key.

If the tool matters to you and the exposure does not sit right, running it
locally with `npm run dev` gives you the whole application and no public URL.

## What is in here

| Path | What it does |
| --- | --- |
| `src/App.jsx` | The entire application |
| `src/storage.js` | IndexedDB store — judgments, full texts, search index |
| `src/api.js` | Anthropic client using your key |
| `.github/workflows/deploy.yml` | Build and publish to Pages |

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
