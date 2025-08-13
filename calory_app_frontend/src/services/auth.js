import { apiPost, apiGet } from "./api";
import { setToken, clearToken, setUser } from "../utils/storage";

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Logs in a user and returns { token, user }.
   * Expects backend endpoint POST /auth/login with { email, password }.
   */
  const data = await apiPost("/auth/login", { email, password });
  if (data?.token) setToken(data.token);
  if (data?.user) setUser(data.user);
  return data;
}

// PUBLIC_INTERFACE
export async function register({ name, email, password }) {
  /** Registers a new user; returns { token?, user? } depending on backend behavior.
   * Expects backend endpoint POST /auth/register with { name, email, password }.
   */
  const data = await apiPost("/auth/register", { name, email, password });
  return data;
}

// PUBLIC_INTERFACE
export async function fetchProfile(token) {
  /** Fetches the authenticated user's profile.
   * Expects backend endpoint GET /auth/me
   */
  return apiGet("/auth/me", token);
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears auth credentials from client. */
  clearToken();
  setUser(null);
}
