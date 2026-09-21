import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * The size of a safe area inset, read straight from the browser.
 *
 * react-native-safe-area-context reports these correctly inside a normal Safari
 * tab and on the phone build, but returns 0 for a web app launched from the
 * home screen — which is the one place where they matter, because there the
 * page runs from the very top of the screen to the very bottom.
 *
 * So we ask CSS instead. A throwaway element is given the height of the inset
 * and then measured. Whatever iOS thinks that value is, this is it.
 */
function useCssInset(name: 'top' | 'bottom', fallback: number): number {
  const [inset, setInset] = useState(fallback);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const measure = () => {
      const probe = document.createElement('div');
      probe.style.cssText =
        `position:fixed;left:0;${name}:0;width:0;visibility:hidden;` +
        `height:env(safe-area-inset-${name},0px);`;
      document.body.appendChild(probe);
      const height = probe.getBoundingClientRect().height;
      probe.remove();
      setInset(Math.max(height, fallback));
    };

    measure();
    // the values change when the phone is rotated
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [name, fallback]);

  return inset;
}

/**
 * The height of the status bar area: how far down a header has to push its text
 * so the clock does not sit on top of it.
 */
export function useSafeTop(fallback = 0): number {
  return useCssInset('top', fallback);
}

/**
 * The height of the home indicator area: how much the tab bar has to leave free
 * at the bottom, or the bar stops short and shows a strip of background below.
 */
export function useSafeBottom(fallback = 8): number {
  return useCssInset('bottom', fallback);
}
