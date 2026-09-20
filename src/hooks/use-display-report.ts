import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type DisplayReport = {
  /** Size of the area the page believes it has. */
  viewport: string;
  /** Size of the physical screen, as the browser reports it. */
  screen: string;
  /** What iOS says about the areas the app must keep clear. */
  insets: string;
  /** Whether iOS launched this as a home screen app rather than a Safari tab. */
  standalone: string;
};

/** Reads one CSS environment value by measuring an element of that height. */
function readInset(name: string): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:fixed;left:0;top:0;width:0;visibility:hidden;height:env(${name},0px);`;
  document.body.appendChild(probe);
  const value = probe.getBoundingClientRect().height;
  probe.remove();
  return Math.round(value);
}

/**
 * Measurements of the screen, shown in the profile while the layout is being
 * sorted out on a real iPhone. Guessing from a desktop browser has already cost
 * three wrong attempts; these four numbers say what is actually happening.
 *
 * To be removed once the layout is settled.
 */
export function useDisplayReport(): DisplayReport | null {
  const [report, setReport] = useState<DisplayReport | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const measure = () => {
      const visual = window.visualViewport;
      setReport({
        viewport: `${Math.round(window.innerWidth)} x ${Math.round(window.innerHeight)}${
          visual ? ` (v ${Math.round(visual.height)})` : ''
        }`,
        screen: `${window.screen.width} x ${window.screen.height}`,
        insets: `t ${readInset('safe-area-inset-top')} · b ${readInset('safe-area-inset-bottom')}`,
        standalone:
          (navigator as { standalone?: boolean }).standalone === true ||
          window.matchMedia('(display-mode: standalone)').matches
            ? 'yes'
            : 'no',
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return report;
}
