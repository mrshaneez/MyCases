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

## Deploying to Cloudflare Pages from GitHub

1. Push this to your GitHub repository.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, and pick the repository.
3. Build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | leave empty |

4. **Save and Deploy.** Every push to `main` redeploys after that.

`.node-version` pins Node 20. Without it Cloudflare may pick an older Node than
Vite 5 supports, and the build fails with an unhelpful error.

`public/_headers` is copied into `dist/` at build time and read by Cloudflare.
It sets a few sensible response headers and carries a content security policy
you can switch on — see the comments in that file.

## Put it behind a login

A Pages site is public by default: anyone with the URL can open it. For this
application you almost certainly want **Cloudflare Access**, which is included
free for small numbers of users and is the main reason to prefer Cloudflare here.

Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**,
point it at your `*.pages.dev` hostname, and add a policy allowing your own email
address. Cloudflare then requires a one-time code sent to that address before
anyone reaches the site. Add the policy to preview deployments too, not only
production — preview URLs are public and easy to forget.

## What is and is not exposed

**Your judgments are not published.** They live in this browser's IndexedDB on
the machine you use, not in the repository and not on Cloudflare. Deploying
publishes the application, not your casebook.

**Do not commit judgments or backups.** `.gitignore` excludes `*.docx`, `*.doc`
and `casebook-*.json` for that reason. Check `git status` before you commit.

**The API key is yours and lives in your browser.** Paste it under Settings. It
is stored in `localStorage` and sent directly to Anthropic. Never put a key in
the source, or in a Cloudflare environment variable read at build time — a key
baked into a static site is readable by anyone who visits it.

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
| `public/_headers` | Response headers for Cloudflare |
| `.node-version` | Pins Node 20 for the build |

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
