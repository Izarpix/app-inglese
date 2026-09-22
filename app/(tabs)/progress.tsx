import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Gradient } from '@/components/london/gradient';
import { AppIcon } from '@/components/app-icon';
import { LondonHeroArt } from '@/components/london/hero-art';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius, Shadows } from '@/constants/london';
import { getUnit, STUDY_CATEGORIES } from '@/src/content';

const PROFILE_SIZED_ART = { width: '74%' as const, height: 224, right: -20, top: -12, opacity: 0.58 };

type Category = (typeof STUDY_CATEGORIES)[number];

/** A subject-first library. The Practice tab remains for mixed sessions. */
export default function LearnScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const selectedUnits = category?.unitIds.map(getUnit).filter((unit) => unit !== undefined) ?? [];

  return <View style={styles.root}><ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <SafeTop><Gradient colors={Gradients.tube} style={[styles.header, { minHeight: 205 }]}>
      <LondonHeroArt variant="progress" style={[styles.headerArt, PROFILE_SIZED_ART]} />
      <View style={styles.headerContent}>
        {category ? <Pressable onPress={() => setCategory(null)} style={styles.back} hitSlop={8}><AppIcon name="arrow-left" size={18} color={London.white} /><Text style={styles.backText}>All subjects</Text></Pressable> : <Text style={styles.kicker}>YOUR LEARNING LIBRARY</Text>}
        <Text style={styles.title}>{category?.title ?? 'Learn'}</Text>
        <Text style={styles.subtitle}>{category?.subtitle ?? 'Choose a subject, then work through each topic in order.'}</Text>
      </View>
    </Gradient></SafeTop>
    <View style={styles.body}>
      {category ? <>
        {category.id === 'grammar' ? <Pressable onPress={() => router.push('/irregular-verbs' as never)} style={styles.topic}><View style={styles.topicText}><Text style={styles.topicTitle}>Irregular verbs table</Text><Text style={styles.topicSummary}>Base form, past simple, past participle and Italian meaning.</Text></View><AppIcon name="table-large" size={22} color={London.tube} /></Pressable> : null}
        <Text style={styles.sectionKicker}>TOPICS IN ORDER</Text>
        <Text style={styles.intro}>Read the note first, then practise the topic when you are ready.</Text>
        <View style={styles.topicList}>{selectedUnits.map((unit, index) => <View key={unit.id} style={styles.topicRow}>
          <View style={styles.rail}><View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>{index < selectedUnits.length - 1 ? <View style={styles.line} /> : null}</View>
          <Pressable onPress={() => router.push({ pathname: '/lesson', params: { id: unit.id } })} style={({ pressed }) => [styles.topic, pressed && styles.pressed]}>
            <View style={styles.topicText}><Text style={styles.topicTitle}>{unit.title}</Text><Text style={styles.topicSummary}>{unit.summary}</Text><Text style={styles.topicMeta}>{unit.cards.length} activities · {unit.level}</Text></View><AppIcon name="chevron-right" size={22} color={London.tube} />
          </Pressable>
        </View>)}</View>
      </> : <>
        <Text style={styles.sectionKicker}>EXPLORE BY SUBJECT</Text>
        <View style={styles.categoryList}>{STUDY_CATEGORIES.map((item) => {
          const count = item.unitIds.map(getUnit).filter(Boolean).length;
          return <Pressable key={item.id} onPress={() => setCategory(item)} style={({ pressed }) => [styles.category, pressed && styles.pressed]}><View style={styles.categoryIcon}><AppIcon name={item.icon} size={25} color={London.white} /></View><View style={styles.categoryText}><Text style={styles.categoryTitle}>{item.title}</Text><Text style={styles.categorySubtitle}>{item.subtitle}</Text><Text style={styles.categoryMeta}>{count} topics</Text></View><AppIcon name="arrow-right" size={21} color={London.tube} /></Pressable>;
        })}</View>
        <View style={styles.tip}><AppIcon name="lightbulb-on-outline" size={20} color={London.gold} /><Text style={styles.tipText}>For quick variety, return to Practice and start a mixed session: multiple choice, writing tasks and visual flashcards are shuffled together.</Text></View>
      </>}
    </View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone }, scroll: { paddingBottom: 130 }, header: { paddingBottom: 25, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl }, headerArt: { position: 'absolute', width: '70%', height: 196, right: -14, top: -10, opacity: 0.55 }, headerContent: { paddingHorizontal: 20, paddingTop: 14, gap: 5 }, kicker: { color: 'rgba(255,255,255,0.9)', fontSize: 10.5, fontWeight: '900', letterSpacing: 1.5 }, title: { color: London.white, fontSize: 32, fontWeight: '900' }, subtitle: { maxWidth: '78%', color: 'rgba(255,255,255,0.88)', fontSize: 14, lineHeight: 20, fontWeight: '600' }, back: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }, backText: { color: London.white, fontSize: 13, fontWeight: '800' }, body: { padding: 20, gap: 14 }, sectionKicker: { color: London.flagRed, fontSize: 10, fontWeight: '900', letterSpacing: 1.4, marginTop: 4 }, categoryList: { gap: 12 }, category: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: London.white, padding: 16, borderRadius: Radius.lg, borderWidth: 1, borderColor: London.line, ...Shadows.card }, categoryIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: London.royal }, categoryText: { flex: 1, gap: 2 }, categoryTitle: { color: London.cab, fontSize: 18, fontWeight: '900' }, categorySubtitle: { color: London.fog, fontSize: 12.5, lineHeight: 18 }, categoryMeta: { color: London.tube, fontSize: 11, fontWeight: '800', marginTop: 3 }, tip: { flexDirection: 'row', gap: 10, backgroundColor: London.royal, borderRadius: Radius.lg, padding: 15, marginTop: 4 }, tipText: { flex: 1, color: 'rgba(255,255,255,0.9)', fontSize: 12.5, lineHeight: 18 }, intro: { color: London.fog, fontSize: 13.5, lineHeight: 19, marginTop: -8 }, topicList: { gap: 0 }, topicRow: { flexDirection: 'row', gap: 12 }, rail: { width: 32, alignItems: 'center' }, number: { width: 28, height: 28, borderRadius: 14, backgroundColor: London.tube, alignItems: 'center', justifyContent: 'center', zIndex: 1 }, numberText: { color: London.white, fontSize: 12, fontWeight: '900' }, line: { position: 'absolute', top: 27, bottom: -1, width: 2, backgroundColor: London.line }, topic: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: London.white, borderRadius: Radius.md, borderWidth: 1, borderColor: London.line, padding: 14, marginBottom: 12, ...Shadows.card }, topicText: { flex: 1, gap: 3 }, topicTitle: { color: London.cab, fontSize: 15, fontWeight: '800' }, topicSummary: { color: London.fog, fontSize: 12, lineHeight: 17 }, topicMeta: { color: London.tube, fontSize: 10.5, fontWeight: '800', marginTop: 2 }, pressed: { opacity: 0.82 },
});
