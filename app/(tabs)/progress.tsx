import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProgressScreen() {
  return (
    <Screen title="Progressi" subtitle="Come stai andando">
      <ThemedView style={styles.row}>
        <Stat label="Giorni di fila" value="0" />
        <Stat label="Card studiate" value="0" />
        <Stat label="Da ripassare" value="0" />
      </ThemedView>

      <ThemedText style={styles.muted}>
        I numeri sono segnaposto: diventeranno reali quando esisterà il database.
      </ThemedText>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.stat}>
      <ThemedText type="title">{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
  },
  muted: {
    opacity: 0.6,
  },
});
