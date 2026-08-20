# App Inglese

App per imparare l'inglese pensata per **studenti universitari italiani** che, dopo anni di esami, ancora non riescono a *usare* la lingua.

Tre pilastri:
- **Errori L1-specifici** — l'app conosce gli sbagli tipici di chi ha l'italiano come lingua madre e insiste lì.
- **Produzione, non riconoscimento** — si scrive e si parla, non si sceglie fra quattro risposte.
- **Ripasso a intervalli crescenti (FSRS)** — per ricordare davvero, non solo fino all'esame.

## Stato

Fase 2 — l'app gira su iPhone tramite Expo Go: navigazione e tre schermate (Studia, Progressi,
Impostazioni), ancora senza contenuti né database.

## Stack

Expo (React Native) + TypeScript · expo-router · SQLite locale · offline-first, nessun account.

**Expo SDK 54**, non l'ultima: l'app Expo Go pubblicata sull'App Store è ferma alla 54, e un
progetto con SDK più recente non è apribile su nessun telefono.

## Come avviare

```bash
npm install       # solo la prima volta
npx expo start    # poi inquadra il QR con la Fotocamera dell'iPhone
```

iPhone e computer devono essere sulla stessa rete Wi-Fi.

## Documentazione

La documentazione di progetto (`docs/`, `CLAUDE.md`) resta **in locale** e non è pubblicata qui:
su GitHub va solo ciò che serve a far girare l'app.
