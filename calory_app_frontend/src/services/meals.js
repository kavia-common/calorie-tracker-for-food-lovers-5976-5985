import { apiGet, apiPost, apiPut, apiDelete } from "./api";

// PUBLIC_INTERFACE
export async function listMeals(token, { from, to } = {}) {
  /** Lists meals for the authenticated user.
   * Optionally filter by from/to ISO date strings.
   * GET /meals?from=...&to=...
   */
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiGet(`/meals${qs ? `?${qs}` : ""}`, token);
}

// PUBLIC_INTERFACE
export async function addMeal(token, meal) {
  /** Adds a new meal for the user.
   * POST /meals  body: { name, calories, occurredAt }
   */
  return apiPost("/meals", meal, token);
}

// PUBLIC_INTERFACE
export async function updateMeal(token, id, updates) {
  /** Updates an existing meal.
   * PUT /meals/:id
   */
  return apiPut(`/meals/${id}`, updates, token);
}

// PUBLIC_INTERFACE
export async function deleteMeal(token, id) {
  /** Deletes an existing meal.
   * DELETE /meals/:id
   */
  return apiDelete(`/meals/${id}`, token);
}
