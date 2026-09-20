import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * The HTML shell of the web build. Only runs on web, never on the phone app.
 *
 * This is where the app stops being a web page and starts behaving like an app
 * added to the iPhone home screen: no pinch zoom, no browser chrome, no double
 * tap that blows the layout up.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* user-scalable=no is what stops pinch zoom; viewport-fit covers the notch */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        <title>Inglesiamo</title>
        <meta name="description" content="Impara l'inglese e prepara l'esame della magistrale." />
        <meta name="theme-color" content="#012169" />
        <meta name="author" content="Izarpix" />

        {/* Safari: "Aggiungi alla schermata Home" */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Inglesiamo" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const css = `
  /*
   * Full height on an iPhone added to the home screen.
   *
   * "height: 100%" measures the window, which on iOS is not the screen: the app
   * ends up shorter than the display and leaves a dead strip under the tab bar.
   * Pinning the body to all four edges with position: fixed is the one approach
   * iOS cannot argue with, because there is no height to get wrong. 100dvh is
   * kept as well for browsers where fixed positioning behaves differently.
   */
  html {
    height: 100%;
    background-color: #012169;
  }
  body {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    height: 100%;
    height: 100dvh;
    overflow: hidden;              /* the app scrolls inside, not the page */
    overscroll-behavior: none;     /* no bounce, no pull-to-refresh */
    background-color: #F6F1E7;
    -webkit-text-size-adjust: 100%;
  }
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  * {
    -webkit-touch-callout: none;   /* no magnifier on long press */
    -webkit-tap-highlight-color: transparent;
  }
  input, textarea {
    -webkit-user-select: text;
    user-select: text;
    font-size: 16px;   /* under 16px iOS zooms the page when the field is focused */
  }
`;
