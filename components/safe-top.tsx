import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { London } from '@/constants/london';
import { useSafeTop } from '@/src/hooks/use-safe-area';

/**
 * Keeps what it wraps clear of the clock.
 *
 * It wraps the whole coloured header, not just its text, and that is the point
 * (ADR-021). iOS draws the status bar as frosted glass over whatever passes
 * underneath: a header running up to the top edge comes out washed pale up
 * there and no longer matches its own colour two centimetres lower. Leaving the
 * page background under the glass instead makes the strip read as page, and the
 * header hangs below it as a panel with rounded corners.
 *
 * On the web the value comes from CSS, because in a home screen web app
 * react-native-safe-area-context answers 0; on the phone build SafeAreaView is
 * still the right tool.
 */
export function SafeTop({ children, style, ...rest }: PropsWithChildren<ViewProps>) {
  const top = useSafeTop();

  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView edges={['top']} style={style} {...rest}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.webSafeTop, { paddingTop: top + 8 }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  webSafeTop: {
    backgroundColor: London.stone,
  },
});
