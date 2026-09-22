import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Gradient } from '@/components/london/gradient';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius, Shadows } from '@/constants/london';
import { cardsForUnits, PRACTICE_AREAS, PRACTICE_FORMATS } from '@/src/content';

/** Second level of Practice: the same 21 areas, filtered to the chosen format. */
export default function PracticeAreasScreen() {
  const router = useRouter();
  const { format: formatId } = useLocalSearchParams<{ format?: string }>();
  const format = PRACTICE_FORMATS.find((item) => item.id === formatId);
  if (!format) return <View style={styles.root}><Text style={styles.missing}>Exercise type not found.</Text></View>;
  const areas = PRACTICE_AREAS.map((area) => ({ area, count: cardsForUnits(area.unitIds).filter((card) => format.types.includes(card.type)).length })).filter((item) => item.count > 0);
  return <View style={styles.root}><ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <SafeTop><Gradient colors={Gradients.tube} style={styles.header}><View style={styles.headerContent}><Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}><MaterialCommunityIcons name="arrow-left" size={18} color={London.white} /><Text style={styles.backText}>Exercise types</Text></Pressable><Text style={styles.kicker}>STEP 2 OF 2</Text><Text style={styles.title}>{format.title}</Text><Text style={styles.subtitle}>Choose the area you want to practise.</Text></View></Gradient></SafeTop>
    <View style={styles.body}><Text style={styles.sectionKicker}>{areas.length} AVAILABLE STUDY AREAS</Text><View style={styles.list}>{areas.map(({ area, count }, index) => <Pressable key={area.id} onPress={() => router.push({ pathname: '/study', params: { unitIds: area.unitIds.join(','), exerciseTypes: format.types.join(','), title: `${format.title} · ${area.title}` } })} style={({ pressed }) => [styles.area, pressed && styles.pressed]}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View><View style={styles.flex}><Text style={styles.areaTitle}>{area.title}</Text><Text style={styles.areaMeta}>{count} {count === 1 ? 'activity' : 'activities'}</Text></View><MaterialCommunityIcons name="arrow-right" size={20} color={London.tube} /></Pressable>)}</View>{areas.length === 0 ? <Text style={styles.empty}>Activities for this format are being prepared.</Text> : null}</View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: London.stone }, scroll: { paddingBottom: 40 }, missing: { color: London.fog, padding: 30 }, header: { paddingBottom: 25, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl }, headerContent: { paddingHorizontal: 20, paddingTop: 13, gap: 5 }, back: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-start' }, backText: { color: London.white, fontSize: 13, fontWeight: '800' }, kicker: { color: London.gold, fontSize: 10, fontWeight: '900', letterSpacing: 1.4, marginTop: 4 }, title: { color: London.white, fontSize: 29, fontWeight: '900' }, subtitle: { color: 'rgba(255,255,255,0.86)', fontSize: 14 }, body: { padding: 20, gap: 13 }, sectionKicker: { color: London.flagRed, fontSize: 10, fontWeight: '900', letterSpacing: 1.3 }, list: { gap: 10 }, area: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, backgroundColor: London.white, borderRadius: Radius.md, borderWidth: 1, borderColor: London.line, ...Shadows.card }, number: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: London.sky }, numberText: { color: London.royal, fontSize: 12, fontWeight: '900' }, flex: { flex: 1 }, areaTitle: { color: London.cab, fontSize: 15, fontWeight: '800' }, areaMeta: { color: London.tube, fontSize: 11, fontWeight: '800', marginTop: 3 }, empty: { color: London.fog, fontSize: 14, paddingVertical: 20, textAlign: 'center' }, pressed: { opacity: 0.82 } });
