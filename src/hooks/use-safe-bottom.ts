import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * The height of the home indicator area, read straight from the browser.
 *
 * react-native-safe-area-context reports this correctly inside a normal Safari
 * tab but returns 0 for a web app launched from the home screen, which is the
 * one place it matters: the tab bar then stops short and leaves a strip of
 * background below it.
 *
 * So we ask CSS instead. A throwaway element is given the height of
 * env(safe-area-inset-bottom) and then measured. Whatever iOS thinks that value
 * is, this is it.
 */
export function useSafeBottom(fallback = 8): number {
  const [inset, setInset] = useState(fallback);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const measure = () => {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;left:0;bottom:0;width:0;visibility:hidden;height:env(safe-area-inset-bottom,0px);';
      document.body.appendChild(probe);
      const height = probe.getBoundingClientRect().height;
      probe.remove();
      setInset(Math.max(height, fallback));
    };

    measure();
    // the value changes when the phone is rotated
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [fallback]);

  return inset;
}
