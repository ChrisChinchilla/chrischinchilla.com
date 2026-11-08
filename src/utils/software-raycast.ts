const cache = new Map<string, Promise<number | undefined>>();

// shortcut: Raycast has no documented stats API; use its rendered install count until one is available.
export function parseRaycastInstalls(html: string): number | undefined {
  const match = html.match(/>([\d,]+)(?:<!--\s*-->)?\s+Installs</);
  if (!match) return undefined;
  const count = Number(match[1].replaceAll(',', ''));
  return Number.isSafeInteger(count) && count >= 0 ? count : undefined;
}

export function getRaycastInstalls(url: string, fallback?: number): Promise<number | undefined> {
  if (!cache.has(url)) {
    cache.set(
      url,
      (async () => {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
          if (!response.ok) throw new Error(`Raycast returned ${response.status}`);
          return parseRaycastInstalls(await response.text()) ?? fallback;
        } catch {
          console.warn(`Using saved Raycast installs for ${url}`);
          return fallback;
        }
      })()
    );
  }
  return cache.get(url)!;
}
