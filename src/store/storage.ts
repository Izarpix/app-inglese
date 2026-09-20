import { Platform } from 'react-native';

/**
 * The smallest storage that does the job today.
 *
 * On the web — which is how the app is actually used, added to the iPhone home
 * screen from Safari — this is `localStorage`: it survives closing the app,
 * restarting the phone and redeploying a new version. On the native build it
 * keeps everything in memory until we add SQLite.
 *
 * Every call is wrapped: Safari in private browsing throws on `localStorage`,
 * and a crash at startup over a saved score would be absurd.
 */

const memory = new Map<string, string>();

function browserStorage(): Storage | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = browserStorage()?.getItem(key) ?? memory.get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): void {
  try {
    const raw = JSON.stringify(value);
    memory.set(key, raw);
    browserStorage()?.setItem(key, raw);
  } catch {
    // out of quota or private mode: losing a save is better than crashing
  }
}

/** Raw string access, for libraries that want to manage their own encoding. */
export function loadRaw(key: string): string | null {
  try {
    return browserStorage()?.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return null;
  }
}

export function saveRaw(key: string, value: string): void {
  try {
    memory.set(key, value);
    browserStorage()?.setItem(key, value);
  } catch {
    // out of quota or private mode
  }
}

export function removeRaw(key: string): void {
  try {
    memory.delete(key);
    browserStorage()?.removeItem(key);
  } catch {
    // nothing to do
  }
}

/**
 * A stable id for this installation, created the first time the app runs.
 * It is how the scores of each friend will be told apart once there is a
 * server, without asking anybody for an email address.
 */
export function deviceId(): string {
  const existing = load<string>('device-id', '');
  if (existing) return existing;

  const fresh = `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  save('device-id', fresh);
  return fresh;
}
