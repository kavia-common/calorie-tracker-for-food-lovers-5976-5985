import { apiGet } from "./api";

// PUBLIC_INTERFACE
export async function searchFoods(token, query) {
  /** Searches the food database by query term.
   * GET /foods/search?q=...
   */
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  return apiGet(`/foods/search?${params.toString()}`, token);
}
