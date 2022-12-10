// Function takes an object and adds it as a query to the url
// It gets the current url and adds the query to it
export function buildLink(
  query: Record<string, string | number | boolean>
): string {
  if (typeof window === "undefined") {
    return "";
  }
  const url = new URL(window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value.toString());
  }
  return url.toString();
}
