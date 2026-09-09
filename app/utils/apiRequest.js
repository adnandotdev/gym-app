export function normalizeRequestOptions(method, options = {}) {
  const { body, data, headers = {} } = options;
  return {
    method,
    body: body !== undefined ? body : data,
    headers,
  };
}
