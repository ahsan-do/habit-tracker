import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppPalette } from "@/lib/theme";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const colors = useAppPalette();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginBottom: 4 }, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 74, paddingTop: 7 } }}>
      <Tabs.Screen name="index" options={{ title: "Today", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="streaks" options={{ title: "Progress", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={size} color={color} /> }} />
      <Tabs.Screen name="add-habit" options={{ title: "New habit", tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-circle" size={size + 3} color={color} /> }} />
    </Tabs>
  );
}
