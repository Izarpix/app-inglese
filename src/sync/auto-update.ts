import { Platform } from 'react-native';

/**
 * Keeps the web app up to date without having to remove it from the home
 * screen and add it again.
 *
 * Safari, once a web app is installed on the home screen, holds on to the copy
 * it first downloaded and will happily serve it for days. So the app compares
 * two different things:
 *
 *   - the build id baked into this very page at build time (a <meta> tag);
 *   - the build id the server reports in version.json.
 *
 * If they differ, this copy is stale and the page reloads. The first version of
 * this file asked the server for both halves of the comparison, which meant a
 * page rescued from the cache compared the server with itself and always agreed
 * with itself. That is the mistake this comparison exists to avoid.
 */

const VERSION_URL = '/version.json';
const CHECK_EVERY_MS = 60_000;

let timer: ReturnType<typeof setInterval> | null = null;

/** The build this page was made from, written in by scripts/build-web.js. */
export function pageBuildId(): string | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector('meta[name="build-id"]')?.getAttribute('content') ?? null;
}

async function fetchBuildId(): Promise<string | null> {
  try {
    const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const body = (await response.json()) as { build?: string };
    return body.build ?? null;
  } catch {
    // offline, or running the dev server where the file is not stamped
    return null;
  }
}

async function check(): Promise<void> {
  const running = pageBuildId();
  if (!running) return; // dev server: nothing to compare against

  const latest = await fetchBuildId();
  if (!latest || latest === running) return;

  // Drop anything the browser is holding, then ask for the page by a URL it has
  // never seen, which is the one thing Safari cannot answer from its cache.
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  } catch {
    // Cache Storage is not always available; the reload is what matters
  }

  window.location.replace(`${window.location.pathname}?v=${latest}`);
}

/** Starts the check. Does nothing outside the browser. */
export function startAutoUpdate(): () => void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return () => {};
  if (timer) return stopAutoUpdate;

  // straight away: this is the moment a stale copy is most likely to be running
  void check();

  timer = setInterval(() => void check(), CHECK_EVERY_MS);

  // coming back to the app after a while is the other likely moment
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void check();
  });

  return stopAutoUpdate;
}

export function stopAutoUpdate(): void {
  if (timer) clearInterval(timer);
  timer = null;
}
