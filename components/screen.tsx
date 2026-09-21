import { StyleSheet, type ViewProps } from 'react-native';

import { SafeTop } from '@/components/safe-top';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ScreenProps = ViewProps & {
  title: string;
  subtitle?: string;
};

/**
 * Shared page frame: safe area, padding, title and optional subtitle.
 * Every tab screen uses it so headings stay consistent across the app.
 */
export function Screen({ title, subtitle, children, style, ...rest }: ScreenProps) {
  return (
    <ThemedView style={styles.root}>
      <SafeTop style={styles.safeArea}>
        <ThemedView style={[styles.content, style]} {...rest}>
          <ThemedText type="title">{title}</ThemedText>
          {subtitle ? (
            <ThemedText type="default" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          ) : null}
          {children}
        </ThemedView>
      </SafeTop>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  subtitle: {
    opacity: 0.7,
  },
});
