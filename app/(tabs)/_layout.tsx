import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { TabBarPill } from '@/components/tab-bar-pill';
import { London } from '@/constants/london';
import { useDeadBottom, useSafeBottom } from '@/src/hooks/use-safe-area';

export default function TabLayout() {
  // Two sources, because neither is right everywhere: the library is right in a
  // normal browser and on the native build, the CSS probe is right for a web
  // app launched from the iPhone home screen. The taller of the two is the one
  // that actually clears the home indicator.
  const insets = useSafeAreaInsets();
  const cssBottom = useSafeBottom();
  const needed = Math.max(insets.bottom, cssBottom, 10);

  // iOS standalone can make the layout viewport shorter than the display. The
  // bar stays in the layout but is painted down through that missing distance,
  // exactly like the floating navigation shown in the reference app.
  const dead = useDeadBottom();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: London.royal,
        tabBarInactiveTintColor: London.fog,
        // The pill floats over the page, as in a native app. On iPhone Home
        // Screen, WebKit makes the layout viewport shorter than the display;
        // translating by `dead` paints the pill into that extra area while the
        // `bottom` value still keeps it clear of the home indicator.
        tabBarBackground: () => <TabBarPill />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: needed,
          height: 70,
          paddingTop: 6,
          paddingBottom: 6,
          transform: [{ translateY: dead }],
        },
        // Without an explicit line height the web build squeezes the label to a
        // few pixels and clips it; flexShrink keeps it from being compressed.
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '700', lineHeight: 15, flexShrink: 0, marginTop: 2 },
        tabBarIconStyle: { flexShrink: 0 },
        /*
         * Centred, and said out loud. The button's own default is to stack icon
         * and label from the top with 5 pt of padding: 24 + 15 + padding needs
         * more room than the button has, so the label slid out of the bottom and
         * came to rest on the edge of the pill. Zero padding and justifyContent
         * let the pair sit in the middle of the 58 pt the pill gives them.
         */
        // The 1 pt at the top is not a fudge: the label's line box carries empty
        // space under the text, so centring the *box* leaves the ink sitting
        // high. Measured in the browser, from the icon to the edge of the pill:
        // 5/7 with no padding, 7/5 with 2 pt, 6/6 with this.
        tabBarItemStyle: { paddingTop: 1, paddingBottom: 0, justifyContent: 'center' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Study',
          tabBarIcon: ({ color, focused }) => <TabIcon name="cards" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => <TabIcon name="chart-box" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => <TabIcon name="trophy" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon name="account-circle" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused }: { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string; focused: boolean }) {
  return (
    <View style={[styles.icon, focused && styles.iconFocused]}>
      <MaterialCommunityIcons name={name} size={focused ? 21 : 22} color={focused ? London.white : color} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { width: 34, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  iconFocused: { backgroundColor: London.royal },
});
