import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Gradient } from '@/components/london/gradient';
import { PhoneBox } from '@/components/london/phone-box';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius } from '@/constants/london';
import { allCards, units } from '@/src/content';
import { computeRewards, isUnlocked } from '@/src/domain/rewards';
import { useAppState, type Profile } from '@/src/store/app-state';
import { pageBuildId } from '@/src/sync/auto-update';
import { ensureSession, flush, pendingCount } from '@/src/sync/remote';

const LEVELS: Profile['level'][] = ['B1', 'B2', 'C1'];
const GOALS = [5, 10, 20, 30];

/**
 * One flat screen: who you are, how much you want to study, what the app knows.
 * No sub-pages on purpose — everything you might want to change is visible here.
 */
export default function ProfileScreen() {
  const { profile, setProfile, answers } = useAppState();
  const unlocked = computeRewards(answers).filter(isUnlocked).length;
  const [account, setAccount] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  // Temporary readout: tells us what iOS reports for the home indicator area,
  // which is what the tab bar has to cover. Remove once the layout is settled.

  // Opening this screen is a good moment to retry anything still waiting.
  useEffect(() => {
    let alive = true;
    void (async () => {
      await flush();
      const id = await ensureSession();
      if (!alive) return;
      setAccount(id);
      setPending(pendingCount());
    })();
    return () => {
      alive = false;
    };
  }, [answers.length]);

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <SafeTop>
            <Gradient colors={Gradients.royal} style={styles.header}>
              <PhoneBox height={118} style={styles.phoneBox} />
              <View style={styles.headerContent}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(profile.name.trim()[0] ?? '?').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.name}>{profile.name.trim() || 'Student'}</Text>
                <Text style={styles.subtitle}>
                  Level {profile.level} · {answers.length} answers · {unlocked} rewards
                </Text>
              </View>
            </Gradient>
          </SafeTop>

          <View style={styles.body}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              value={profile.name}
              onChangeText={(name) => setProfile({ name })}
              placeholder="What is your name?"
              placeholderTextColor={London.fog}
              style={styles.input}
            />

            <Text style={styles.label}>Level</Text>
            <View style={styles.pills}>
              {LEVELS.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setProfile({ level })}
                  style={[styles.pill, profile.level === level && styles.pillActive]}>
                  <Text style={[styles.pillText, profile.level === level && styles.pillTextActive]}>
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Cards a day</Text>
            <View style={styles.pills}>
              {GOALS.map((goal) => (
                <Pressable
                  key={goal}
                  onPress={() => setProfile({ dailyGoal: goal })}
                  style={[styles.pill, profile.dailyGoal === goal && styles.pillActive]}>
                  <Text
                    style={[styles.pillText, profile.dailyGoal === goal && styles.pillTextActive]}>
                    {goal}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.info}>
              <Row icon="cards-outline" label="Cards available" value={`${allCards.length}`} />
              <Row icon="folder-outline" label="Units" value={`${units.length}`} />
              <Row icon="tag-outline" label="Version" value={Constants.expoConfig?.version ?? '--'} />
              <Row icon="palette-outline" label="Made by" value="Izarpix" />
              <Row icon="update" label="Build" value={pageBuildId() ?? 'dev'} />
              <Row
                icon="cloud-check-outline"
                label="Sync"
                value={account ? (pending ? `${pending} waiting` : 'Up to date') : 'Offline'}
              />
              <Row icon="cellphone" label="Expo SDK" value={Constants.expoConfig?.sdkVersion ?? '--'} />
            </View>

            <View style={styles.notice}>
              <MaterialCommunityIcons name="information-outline" size={18} color={London.tube} />
              <Text style={styles.noticeText}>
                Everything is saved on this device first, then sent to the cloud when there is a
                connection. Your scores and your feedback reach the app&apos;s author; nothing else
                is collected, and no email address is ever asked for.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons name={icon} size={18} color={London.fog} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },
  header: {
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  phoneBox: { position: 'absolute', right: 18, bottom: -6, opacity: 0.55 },
  headerContent: { paddingHorizontal: 20, paddingTop: 16, gap: 6 },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: London.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { color: London.royal, fontSize: 27, fontWeight: '900' },
  name: { color: London.white, fontSize: 27, fontWeight: '900' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: '600' },
  body: { padding: 20, gap: 8 },
  label: { color: London.cab, fontSize: 13, fontWeight: '800', marginTop: 12 },
  input: {
    backgroundColor: London.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: London.line,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: London.cab,
  },
  pills: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: London.white,
    borderWidth: 1,
    borderColor: London.line,
  },
  pillActive: { backgroundColor: London.flagRed, borderColor: London.flagRed },
  pillText: { color: London.cab, fontSize: 15, fontWeight: '700' },
  pillTextActive: { color: London.white },
  info: {
    marginTop: 18,
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  rowLabel: { flex: 1, color: London.cab, fontSize: 14 },
  rowValue: { color: London.fog, fontSize: 14, fontWeight: '700' },
  notice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(0,25,168,0.06)',
    borderRadius: Radius.md,
    padding: 14,
    marginTop: 14,
  },
  noticeText: { flex: 1, color: London.cab, fontSize: 12.5, lineHeight: 18 },
});
