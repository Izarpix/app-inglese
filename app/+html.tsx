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
        <meta name="theme-color" content="#102A43" />
        <meta name="author" content="Izarpix" />

        {/* Safari: "Aggiungi alla schermata Home" */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*
          "black-translucent" is the only value that gives the page the whole
          screen. With "black" iOS takes the height of the status bar away from
          the page but still draws it from the top edge, so those same points
          come back as a dead strip under the tab bar: measured on an iPhone 16
          Pro, screen 874, page 812, strip 62 = exactly the status bar.

          The price of translucent is that the clock sits over the page, so
          every header pays the top inset itself (components/safe-top.tsx) while
          its background keeps running up to the edge.
        */}
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
   * The body is pinned to the four edges and its height is "auto" on purpose.
   * Expo injects its own reset before this sheet — #root,body,html{height:100%}
   * — and an explicit height beats "bottom" whenever both are set. That 100% is
   * the window, and in a home screen web app iOS measures the window wrong: the
   * app ends up shorter than the screen and leaves a dead strip under the tab
   * bar. With "auto" the four edges decide, and there is no number to get wrong.
   */
  html {
    height: 100%;
    background-color: #F6F3EC;
  }
  body {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: auto;                  /* beats the Expo reset: see above */
    margin: 0;
    overflow: hidden;              /* the app scrolls inside, not the page */
    overscroll-behavior: none;     /* no bounce, no pull-to-refresh */
    /*
     * Stone, and it is not a detail. On an iPhone the page is 62 pt shorter
     * than the screen (ADR-019) and iOS fills what is left with this colour.
     * It used to be white to hide inside the tab bar; now that the bar floats
     * (components/tab-bar-pill.tsx) the band has to be the colour of the page
     * instead, so it reads as the margin around the bar.
     */
    background-color: #F6F3EC;
    -webkit-text-size-adjust: 100%;
  }
  /*
   * The app itself, filling the body.
   *
   * No padding at the top on purpose. Paying the status bar inset here would
   * push the whole app down and leave a strip of a different colour under the
   * clock; the coloured headers have to run all the way to the top edge. Each
   * header keeps its own text clear of the clock (components/safe-top.tsx).
   */
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #F6F3EC;
  }

  * {
    box-sizing: border-box;
    -webkit-touch-callout: none;   /* no magnifier on long press */
    -webkit-tap-highlight-color: transparent;
  }
  input, textarea {
    -webkit-user-select: text;
    user-select: text;
    font-size: 16px;   /* under 16px iOS zooms the page when the field is focused */
  }
  button, [role="button"] {
    touch-action: manipulation;
  }
`;
