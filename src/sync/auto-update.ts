import { Platform } from 'react-native';

/**
 * Keeps the web app up to date without having to remove it from the home
 * screen and add it again.
 *
 * Safari, once a web app is installed on the home screen, holds on to the page
 * it first downloaded and will happily serve it for days. So the app asks:
 * every minute it fetches `version.json`, which carries the id of the build it
 * came from. If the id on the server is not the one this page started with,
 * a new version has been deployed and the page reloads itself.
 *
 * `cache: 'no-store'` plus a changing query string is what stops Safari from
 * answering the question with the very copy we are trying to replace.
 */

const VERSION_URL = '/version.json';
const CHECK_EVERY_MS = 60_000;

let runningBuild: string | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

async function fetchBuildId(): Promise<string | null> {
  try {
    const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const body = (await response.json()) as { build?: string };
    return body.build ?? null;
  } catch {
    // offline, or the file is not there in development: nothing to do
    return null;
  }
}

/** Starts the check. Does nothing outside the browser. */
export function startAutoUpdate(): () => void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return () => {};
  if (timer) return stopAutoUpdate;

  void (async () => {
    runningBuild = await fetchBuildId();
  })();

  const check = async () => {
    const latest = await fetchBuildId();
    if (!latest) return;

    if (runningBuild === null) {
      runningBuild = latest;
      return;
    }

    if (latest !== runningBuild) {
      // Clear any Cache Storage a browser may have kept, then take the new page.
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {
        // Cache Storage is not always available; the reload is what matters
      }
      window.location.reload();
    }
  };

  timer = setInterval(() => void check(), CHECK_EVERY_MS);

  // Coming back to the app after a while is the most likely moment to be stale.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void check();
  });

  return stopAutoUpdate;
}

export function stopAutoUpdate(): void {
  if (timer) clearInterval(timer);
  timer = null;
}
