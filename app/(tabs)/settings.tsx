import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  return (
    <Screen title="Impostazioni">
      <ThemedView style={styles.card}>
        <Row label="Versione" value={Constants.expoConfig?.version ?? '—'} />
        <Row label="Expo SDK" value={Constants.expoConfig?.sdkVersion ?? '—'} />
      </ThemedView>

      <ThemedText style={styles.muted}>
        Qui andranno l&apos;obiettivo giornaliero, la notifica di ripasso e il livello di partenza.
      </ThemedText>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.row}>
      <ThemedText>{label}</ThemedText>
      <ThemedText style={styles.muted}>{value}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  muted: {
    opacity: 0.6,
  },
});
