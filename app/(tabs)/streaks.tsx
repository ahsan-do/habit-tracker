import { useAuth } from "@/lib/auth-context";
import { useAppPalette } from "@/lib/theme";
import { useAllCompletions, useHabits } from "@/lib/queries";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";

const dayDifference = (newer: string, older: string) => Math.round((new Date(newer).setHours(0, 0, 0, 0) - new Date(older).setHours(0, 0, 0, 0)) / 86_400_000);

export default function StreaksScreen() {
  const colors = useAppPalette();
  const { user } = useAuth();
  const { data: habits = [] } = useHabits(user?.$id ?? "");
  const { data: completions = [] } = useAllCompletions(user?.$id ?? "");
  const insights = habits.map((habit) => {
    const dates = completions.filter((completion) => completion.habit_id === habit.$id).map((completion) => completion.completed_at).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let current = dates.length ? 1 : 0;
    let best = current;
    let run = current;
    for (let index = 1; index < dates.length; index += 1) {
      if (dayDifference(dates[index - 1], dates[index]) <= 1) run += 1;
      else run = 1;
      best = Math.max(best, run);
    }
    return { habit, current, best, total: dates.length };
  }).sort((a, b) => b.best - a.best);
  const topStreak = insights[0]?.best ?? 0;

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Your momentum</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Every check-in adds up. Here&apos;s the progress you&apos;ve earned.</Text>
        <View style={[styles.heroCard, { backgroundColor: colors.warningSoft, borderColor: colors.warningBorder }]}>
          <View style={styles.heroIcon}><MaterialCommunityIcons name="fire" size={29} color="#F59E0B" /></View>
          <View><Text style={[styles.heroValue, { color: colors.warningText }]}>{topStreak} days</Text><Text style={[styles.heroLabel, { color: colors.warningMuted }]}>longest active streak</Text></View>
        </View>
        <Text style={[styles.sectionLabel, { color: colors.subdued }]}>HABIT LEADERBOARD</Text>
        {insights.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><MaterialCommunityIcons name="chart-box-outline" size={40} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.text }]}>Your story starts here</Text><Text style={[styles.emptyText, { color: colors.muted }]}>Complete a habit to see your progress unfold.</Text></View>
        ) : insights.map(({ habit, current, best, total }, index) => (
          <View key={habit.$id} style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.rank, { backgroundColor: index === 0 ? colors.primary : colors.primarySoft }, index === 0 && styles.rankFirst]}><Text style={[styles.rankText, { color: colors.primary }, index === 0 && [styles.rankTextFirst, { color: colors.onPrimary }]]}>{index + 1}</Text></View>
            <View style={styles.rowCopy}><Text style={[styles.habitName, { color: colors.text }]} numberOfLines={1}>{habit.title}</Text><Text style={[styles.total, { color: colors.muted }]}>{total} check-ins</Text></View>
            <View style={styles.stat}><Text style={[styles.statValue, { color: colors.text }]}>{current}</Text><Text style={[styles.statLabel, { color: colors.muted }]}>NOW</Text></View>
            <View style={styles.stat}><Text style={[styles.statValue, { color: colors.text }]}>{best}</Text><Text style={[styles.statLabel, { color: colors.muted }]}>BEST</Text></View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F8FC" }, content: { padding: 20, paddingBottom: 110 },
  title: { color: "#28253A", fontSize: 27, fontWeight: "800", letterSpacing: -0.7, marginTop: 10 }, subtitle: { color: "#858197", fontSize: 14, lineHeight: 21, marginTop: 7 },
  heroCard: { alignItems: "center", backgroundColor: "#FFF6E7", borderColor: "#FFE4B4", borderRadius: 22, borderWidth: 1, flexDirection: "row", marginTop: 25, padding: 19 }, heroIcon: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 23, height: 46, justifyContent: "center", marginRight: 14, width: 46 }, heroValue: { color: "#51350B", fontSize: 21, fontWeight: "800" }, heroLabel: { color: "#9D742D", fontSize: 12, marginTop: 2 },
  sectionLabel: { color: "#817C94", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginBottom: 10, marginTop: 29 },
  row: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#EEEAF6", borderRadius: 18, borderWidth: 1, flexDirection: "row", marginBottom: 10, padding: 14 }, rank: { alignItems: "center", backgroundColor: "#F0EEFF", borderRadius: 15, height: 30, justifyContent: "center", marginRight: 11, width: 30 }, rankFirst: { backgroundColor: "#6C5CE7" }, rankText: { color: "#6C5CE7", fontSize: 13, fontWeight: "800" }, rankTextFirst: { color: "#FFFFFF" }, rowCopy: { flex: 1, paddingRight: 5 }, habitName: { color: "#302D40", fontSize: 15, fontWeight: "800" }, total: { color: "#918CA0", fontSize: 12, marginTop: 3 }, stat: { alignItems: "center", minWidth: 42 }, statValue: { color: "#514C63", fontSize: 16, fontWeight: "800" }, statLabel: { color: "#9994A7", fontSize: 8, fontWeight: "800", letterSpacing: 0.7, marginTop: 2 },
  empty: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#EAE7F2", borderRadius: 22, borderStyle: "dashed", borderWidth: 1.5, padding: 38 }, emptyTitle: { color: "#302D40", fontSize: 17, fontWeight: "800", marginTop: 13 }, emptyText: { color: "#858197", fontSize: 13, lineHeight: 20, marginTop: 6, textAlign: "center" },
});
