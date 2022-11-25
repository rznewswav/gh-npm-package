export async function fetchJson<T = object>(
  input: RequestInfo | URL,
  init?: T | undefined,
): Promise<object> {
  const response = await fetch(input, init);
  return await response.json();
}
