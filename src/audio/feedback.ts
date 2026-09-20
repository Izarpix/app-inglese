import { Platform } from 'react-native';

/**
 * Short feedback sounds, synthesised in the browser instead of shipped as files.
 *
 * The app is used mainly as a web app added to the iPhone home screen, and the
 * Web Audio API can make a clean chime from nothing — no audio library, no
 * megabytes of assets. On the native build it stays silent and the haptics do
 * the job, until we add `expo-audio`.
 */

type Note = { frequency: number; start: number; duration: number };

const TUNES = {
  // rising major third: "yes"
  correct: [
    { frequency: 660, start: 0, duration: 0.11 },
    { frequency: 880, start: 0.09, duration: 0.16 },
  ],
  // single soft tone: "close"
  almost: [{ frequency: 520, start: 0, duration: 0.16 }],
  // falling tone, low enough not to feel like a punishment
  wrong: [
    { frequency: 300, start: 0, duration: 0.12 },
    { frequency: 220, start: 0.1, duration: 0.18 },
  ],
  // three notes up: end of session
  complete: [
    { frequency: 523, start: 0, duration: 0.13 },
    { frequency: 659, start: 0.12, duration: 0.13 },
    { frequency: 784, start: 0.24, duration: 0.26 },
  ],
  // little fanfare for a badge
  reward: [
    { frequency: 659, start: 0, duration: 0.1 },
    { frequency: 784, start: 0.09, duration: 0.1 },
    { frequency: 988, start: 0.18, duration: 0.1 },
    { frequency: 1319, start: 0.27, duration: 0.3 },
  ],
} satisfies Record<string, Note[]>;

export type Tune = keyof typeof TUNES;

let context: AudioContext | null = null;
let enabled = true;

function audioContext(): AudioContext | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  context ??= new Ctor();
  // Safari starts the context suspended until a tap; our sounds always follow one.
  if (context.state === 'suspended') void context.resume();
  return context;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function play(tune: Tune) {
  if (!enabled) return;

  const ctx = audioContext();
  if (!ctx) return;

  for (const note of TUNES[tune]) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + note.start;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.frequency, start);

    // quick attack, exponential release: a chime instead of a beep
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + note.duration + 0.02);
  }
}
