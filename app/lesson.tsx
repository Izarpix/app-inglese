import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Gradient } from '@/components/london/gradient';
import { UnionJack } from '@/components/london/union-jack';
import { Gradients, London, Radius } from '@/constants/london';
import { getLesson } from '@/src/content/lessons';

/**
 * One lesson, rendered from its fixed four blocks. The screen has no branching
 * per topic on purpose: whatever the subject, the reader finds the rule at the
 * top, the table under it, the examples after, the traps at the bottom.
 */
export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lesson = id ? getLesson(id) : undefined;

  if (!lesson) {
    return (
      <View style={styles.root}>
        <Text style={styles.missing}>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Gradient colors={Gradients.royal} style={styles.header}>
          <UnionJack width={220} style={styles.flag} />
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <Pressable onPress={() => router.back()} hitSlop={10} style={styles.close}>
                <MaterialCommunityIcons name="close" size={24} color={London.white} />
              </Pressable>
              <Text style={styles.kicker}>GRAMMAR NOTE · LEVEL {lesson.level}</Text>
              <Text style={styles.title}>{lesson.title}</Text>
              <Text style={styles.summary}>{lesson.summary}</Text>
            </View>
          </SafeAreaView>
        </Gradient>

        <View style={styles.body}>
          {/* 1. THE RULE — the most important thing on the screen, so it looks it */}
          <View style={styles.ruleCard}>
            <View style={styles.ruleHead}>
              <MaterialCommunityIcons name="key-variant" size={18} color={London.royal} />
              <Text style={styles.ruleHeadText}>THE RULE IN ONE SENTENCE</Text>
            </View>
            <Text style={styles.ruleText}>{lesson.rule}</Text>
          </View>

          {/* 2. THE SCHEMA */}
          <Block icon="table" title="The key table" accent={London.tube}>
            <View style={styles.table}>
              {lesson.schema.map((row, i) => (
                <View
                  key={row.label}
                  style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                  <Text style={styles.tableLabel}>{row.label}</Text>
                  <Text style={styles.tableValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Block>

          {/* 3. EXAMPLES — always wrong then right */}
          <Block icon="compare-horizontal" title="Wrong and right" accent={London.park}>
            {lesson.examples.map((example) => (
              <View key={example.right} style={styles.example}>
                <View style={styles.exampleLine}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={London.flagRed} />
                  <Text style={styles.wrong}>{example.wrong}</Text>
                </View>
                <View style={styles.exampleLine}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={London.park} />
                  <Text style={styles.right}>{example.right}</Text>
                </View>
                <Text style={styles.note}>{example.note}</Text>
              </View>
            ))}
          </Block>

          {/* 4. TRAPS */}
          <Block icon="alert-octagon" title="Traps for Italian speakers" accent={London.flagRed}>
            {lesson.traps.map((trap, i) => (
              <View key={trap} style={styles.trap}>
                <View style={styles.trapNumber}>
                  <Text style={styles.trapNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.trapText}>{trap}</Text>
              </View>
            ))}
          </Block>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>Got it</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Block({
  icon,
  title,
  accent,
  children,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.blockHead}>
        <View style={[styles.blockDot, { backgroundColor: accent }]}>
          <MaterialCommunityIcons name={icon} size={14} color={London.white} />
        </View>
        <Text style={styles.blockTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },
  missing: { padding: 30, color: London.fog },

  header: { paddingBottom: 26 },
  flag: {
    position: 'absolute',
    right: -60,
    top: 30,
    opacity: 0.14,
    transform: [{ rotate: '-10deg' }],
  },
  headerContent: { paddingHorizontal: 20, paddingTop: 10, gap: 5 },
  close: { alignSelf: 'flex-start', marginBottom: 10 },
  kicker: { color: London.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: London.white, fontSize: 27, fontWeight: '900', lineHeight: 33 },
  summary: { color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 20 },

  body: { padding: 20, gap: 16 },

  ruleCard: {
    backgroundColor: London.gold,
    borderRadius: Radius.lg,
    padding: 18,
    gap: 8,
  },
  ruleHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  ruleHeadText: { color: London.royal, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  ruleText: { color: '#3A2B00', fontSize: 17, lineHeight: 25, fontWeight: '700' },

  block: {
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    padding: 16,
    gap: 12,
  },
  blockHead: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  blockDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  blockTitle: { color: London.cab, fontSize: 16, fontWeight: '800' },

  table: { borderRadius: Radius.sm, overflow: 'hidden' },
  tableRow: { paddingVertical: 10, paddingHorizontal: 12, gap: 3 },
  tableRowAlt: { backgroundColor: London.stone },
  tableLabel: { color: London.fog, fontSize: 12.5, lineHeight: 17, fontWeight: '600' },
  tableValue: { color: London.cab, fontSize: 14.5, lineHeight: 20, fontWeight: '700' },

  example: { gap: 5, paddingVertical: 8, borderTopWidth: 1, borderTopColor: London.line },
  exampleLine: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  wrong: {
    flex: 1,
    color: London.flagRed,
    fontSize: 14.5,
    lineHeight: 20,
    textDecorationLine: 'line-through',
  },
  right: { flex: 1, color: London.park, fontSize: 14.5, lineHeight: 20, fontWeight: '700' },
  note: { color: London.fog, fontSize: 12.5, lineHeight: 18, marginLeft: 24 },

  trap: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  trapNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FBE9EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trapNumberText: { color: London.flagRed, fontSize: 12, fontWeight: '900' },
  trapText: { flex: 1, color: London.cab, fontSize: 13.5, lineHeight: 20 },

  primary: {
    backgroundColor: London.royal,
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  primaryText: { color: London.white, fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
