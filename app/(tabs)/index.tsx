import { StyleSheet } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function StudyScreen() {
  return (
    <Screen title="Studia" subtitle="La sessione di oggi">
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Nessuna card da ripassare</ThemedText>
        <ThemedText style={styles.muted}>
          Qui comparirà la sessione giornaliera: le card in scadenza secondo l&apos;algoritmo di
          ripasso, più gli esercizi sugli errori tipici degli italiani.
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.muted}>Prossimo passo: database SQLite e prime card.</ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  muted: {
    opacity: 0.6,
  },
});
