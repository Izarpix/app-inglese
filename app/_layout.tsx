import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { London } from '@/constants/london';
import { AppStateProvider } from '@/src/store/app-state';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * The app keeps the London palette in both system themes: the colours are the
 * identity, so a dark mode that greys them out would be a different app.
 */
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: London.stone,
    card: London.white,
    primary: London.flagRed,
    text: London.cab,
    border: London.line,
  },
};

export default function RootLayout() {
  return (
    <AppStateProvider>
      <ThemeProvider value={AppTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: London.stone } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="study" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="lesson" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AppStateProvider>
  );
}
