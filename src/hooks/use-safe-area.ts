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

/**
 * The points of screen the page does not have.
 *
 * Measured on an iPhone 16 Pro with the app on the home screen: the screen is
 * 874 pt, the window iOS hands the page is 812, and the page is drawn from the
 * top edge anyway. Those 62 pt — exactly the status bar — end up *under* the
 * app, outside the page, and no CSS can reach them: iOS fills them with the
 * body background, which is why that is white (app/+html.tsx).
 *
 * They are still screen, though, and the eye counts them. If the tab bar also
 * paid the home indicator inset on top of them, its icons would float about a
 * centimetre too high — which is exactly what "the tab bar is detached from the
 * bottom" looks like. So whoever pays a bottom inset subtracts this first.
 *
 * Zero everywhere else: in a browser tab, on the phone build, in landscape.
 */
export function useDeadBottom(): number {
  const [dead, setDead] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const measure = () => {
      const standalone =
        (navigator as { standalone?: boolean }).standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
      const portrait = window.innerHeight > window.innerWidth;
      if (!standalone || !portrait) {
        setDead(0);
        return;
      }
      // screen.height does not follow the rotation on iOS, hence the portrait check
      const missing = window.screen.height - window.innerHeight;
      if (!(missing > 0 && missing < 120)) {
        setDead(0);
        return;
      }
      /*
       * Where the missing points are depends on where the page starts, and the
       * top inset says it: a page that runs under the clock has to keep that
       * space clear (inset > 0) and loses its points at the BOTTOM; a page iOS
       * has already pushed below the status bar has nothing to keep clear
       * (inset 0) and lost the same points at the TOP, where they cost nothing.
       * Subtracting them from the tab bar in that second case would push the
       * bar onto the home indicator.
       */
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;left:0;top:0;width:0;visibility:hidden;height:env(safe-area-inset-top,0px);';
      document.body.appendChild(probe);
      const top = probe.getBoundingClientRect().height;
      probe.remove();
      setDead(top > 0 ? missing : 0);
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  return dead;
}
