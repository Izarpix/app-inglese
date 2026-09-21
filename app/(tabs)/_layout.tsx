import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
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

  // ...minus the screen the page never got. Those points are already white and
  // already below the bar: paying the inset on top of them lifts the icons a
  // centimetre off the bottom of the screen. See useDeadBottom.
  const dead = useDeadBottom();
  const bottom = Math.max(needed - dead, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: London.flagRed,
        tabBarInactiveTintColor: London.fog,
        /*
         * A floating bar, not a bar glued to the bottom. On the iPhone the page
         * stops 62 pt above the edge of the screen (ADR-019) and no bar can
         * reach it; floating turns that gap from a defect into margin. The bar
         * itself is transparent — the white shape is drawn by TabBarPill — but
         * it still takes up room in the layout, so nothing hides behind it.
         */
        tabBarBackground: () => <TabBarPill bottom={bottom} />,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 70 + bottom,
          paddingTop: 6,
          paddingBottom: 6 + bottom,
        },
        // Without an explicit line height the web build squeezes the label to a
        // few pixels and clips it; flexShrink keeps it from being compressed.
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', lineHeight: 15, flexShrink: 0, marginTop: 3 },
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
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cards" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trophy" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
