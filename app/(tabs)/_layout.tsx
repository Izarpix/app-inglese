import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { London } from '@/constants/london';

export default function TabLayout() {
  // The web build has no safe area, so the labels would sit on the very edge of
  // the screen; a minimum of 10 points keeps them off it everywhere.
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: London.flagRed,
        tabBarInactiveTintColor: London.fog,
        tabBarStyle: {
          backgroundColor: London.white,
          borderTopColor: London.line,
          height: 58 + bottom,
          paddingBottom: bottom,
        },
        // Without an explicit line height the web build squeezes the label to a
        // few pixels and clips it; flexShrink keeps it from being compressed.
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', lineHeight: 15, flexShrink: 0 },
        tabBarIconStyle: { flexShrink: 0 },
        tabBarItemStyle: { paddingVertical: 6 },
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
