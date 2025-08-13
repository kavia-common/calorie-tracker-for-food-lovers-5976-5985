const TOKEN_KEY = "ctfl_auth_token";
const USER_KEY = "ctfl_user";

let inMemoryToken = null;

/**
 * INTERNAL: Prefer in-memory token for runtime safety; fall back to localStorage.
 */
function getLocalStorageSafe() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getToken() {
  /** Returns the current auth token from memory or localStorage. */
  if (inMemoryToken) return inMemoryToken;
  const ls = getLocalStorageSafe();
  return ls ? ls.getItem(TOKEN_KEY) : null;
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Sets the auth token in memory and localStorage. */
  inMemoryToken = token || null;
  const ls = getLocalStorageSafe();
  if (ls) {
    if (token) ls.setItem(TOKEN_KEY, token);
    else ls.removeItem(TOKEN_KEY);
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clears the auth token from memory and storage. */
  inMemoryToken = null;
  const ls = getLocalStorageSafe();
  if (ls) ls.removeItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function getUser() {
  /** Returns the cached user profile if present. */
  const ls = getLocalStorageSafe();
  if (!ls) return null;
  const raw = ls.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setUser(user) {
  /** Caches the user profile in localStorage. */
  const ls = getLocalStorageSafe();
  if (!ls) return;
  if (!user) {
    ls.removeItem(USER_KEY);
  } else {
    ls.setItem(USER_KEY, JSON.stringify(user));
  }
}
