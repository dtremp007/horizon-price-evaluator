export function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${window.location.origin}${path}`, options);
}
