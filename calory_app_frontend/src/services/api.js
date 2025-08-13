const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

/**
 * INTERNAL: Builds a fully qualified API URL.
 * @param {string} path - The endpoint path (e.g. /auth/login)
 * @returns {string} - Fully qualified URL
 */
function buildUrl(path) {
  if (!API_BASE_URL) {
    // Intentionally not throwing; this allows the UI to render even if not configured yet.
    // Calls will fail gracefully with a clear message from fetch wrappers.
    // Configure REACT_APP_API_BASE_URL in your .env file.
  }
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${trimmed}`;
}

/**
 * INTERNAL: Common fetch wrapper with error handling.
 */
async function request(path, { method = "GET", body, token, headers = {} } = {}) {
  const url = buildUrl(path);
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  let res;
  try {
    res = await fetch(url, init);
  } catch (e) {
    throw new Error(`Network error contacting API: ${e.message}`);
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = data?.message || data?.error || `API error (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function apiGet(path, token, headers) {
  /** Performs a GET request to the API.
   * @param {string} path - Endpoint path
   * @param {string} token - Optional bearer token
   * @param {object} headers - Optional extra headers
   * @returns {Promise<any>} JSON response
   */
  return request(path, { method: "GET", token, headers });
}

// PUBLIC_INTERFACE
export async function apiPost(path, body, token, headers) {
  /** Performs a POST request to the API.
   * @param {string} path - Endpoint path
   * @param {object} body - JSON body
   * @param {string} token - Optional bearer token
   * @param {object} headers - Optional extra headers
   * @returns {Promise<any>} JSON response
   */
  return request(path, { method: "POST", body, token, headers });
}

// PUBLIC_INTERFACE
export async function apiPut(path, body, token, headers) {
  /** Performs a PUT request to the API.
   * @param {string} path - Endpoint path
   * @param {object} body - JSON body
   * @param {string} token - Optional bearer token
   * @param {object} headers - Optional extra headers
   * @returns {Promise<any>} JSON response
   */
  return request(path, { method: "PUT", body, token, headers });
}

// PUBLIC_INTERFACE
export async function apiDelete(path, token, headers) {
  /** Performs a DELETE request to the API.
   * @param {string} path - Endpoint path
   * @param {string} token - Optional bearer token
   * @param {object} headers - Optional extra headers
   * @returns {Promise<any>} JSON response
   */
  return request(path, { method: "DELETE", token, headers });
}
