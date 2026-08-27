// Talking to the model.
//
// Inside Claude these requests were signed by the host. On your own deployment
// they are not, so the app uses an API key you paste in once. It is kept in
// this browser's localStorage and sent straight to Anthropic — it never goes
// to GitHub, to this site's host, or anywhere else.
//
// Read this before using it on reserved drafts: the request contains the text
// you are checking. Anthropic's API does not train on API traffic, but the
// draft does leave your machine. That is a decision worth making deliberately
// rather than by habit. Ask and Consistency send passages from delivered
// judgments; Before I decide and Challenge send the draft itself.

const KEY_NAME = "casebook:apikey";
const MODEL = "claude-sonnet-4-6";

export function getKey() {
  try {
    return localStorage.getItem(KEY_NAME) || "";
  } catch {
    return "";
  }
}

export function setKey(k) {
  try {
    if (k) localStorage.setItem(KEY_NAME, k.trim());
    else localStorage.removeItem(KEY_NAME);
  } catch {
    /* private browsing; the key just won't persist */
  }
}

export class NoKeyError extends Error {
  constructor() {
    super("No API key set");
    this.name = "NoKeyError";
  }
}

// Returns the same shape the app expects: { content: [{type, text}, ...] }
export async function messages(prompt, maxTokens = 1000) {
  const key = getKey();
  if (!key) throw new NoKeyError();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      // Required for browser-originated requests.
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}
