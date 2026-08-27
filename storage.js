// Storage for the casebook.
//
// Inside Claude the app used window.storage, which does not exist on the open
// web. This is a drop-in replacement with the same four methods, backed by
// IndexedDB rather than localStorage: localStorage caps out around 5MB across
// the whole origin, which a few hundred full judgments would exceed. IndexedDB
// has no practical limit for this and stores strings just as happily.
//
// Everything stays in the browser on this machine. Nothing is uploaded, and
// nothing is shared between browsers or devices — use the backup file for that.

const DB_NAME = "casebook";
const STORE = "kv";
let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(mode, run) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = run(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const storage = {
  // Resolves to { key, value } or throws when the key is absent, matching the
  // behaviour the app was written against.
  async get(key) {
    const value = await tx("readonly", (s) => s.get(key));
    if (value === undefined) throw new Error("Not found: " + key);
    return { key, value, shared: false };
  },

  async set(key, value) {
    await tx("readwrite", (s) => s.put(value, key));
    return { key, value, shared: false };
  },

  async delete(key) {
    await tx("readwrite", (s) => s.delete(key));
    return { key, deleted: true, shared: false };
  },

  async list(prefix = "") {
    const keys = await tx("readonly", (s) => s.getAllKeys());
    return { keys: keys.filter((k) => String(k).startsWith(prefix)), prefix, shared: false };
  },
};

// How much of the disk the browser has handed the casebook, for the settings
// screen. Not supported everywhere, so callers should tolerate nulls.
export async function usage() {
  if (!navigator.storage?.estimate) return null;
  try {
    const { usage: used, quota } = await navigator.storage.estimate();
    return { used, quota };
  } catch {
    return null;
  }
}
