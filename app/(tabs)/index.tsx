import HabitsList from "@/app/components/HabitsList";
import { useAuth } from "@/lib/auth-context";
import {
  useCompleteHabit,
  useDeleteHabit,
  useHabits,
  useTodayCompletions,
} from "@/lib/queries";
import { useAppPalette } from "@/lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useAppPalette();
  const { signOut, user } = useAuth();
  const router = useRouter();
  const {
    data: habits = [],
    refetch: refetchHabits,
    isRefetching,
  } = useHabits(user?.$id ?? "");
  const { data: completions = [], refetch: refetchCompletions } =
    useTodayCompletions(user?.$id ?? "");
  const deleteHabit = useDeleteHabit();
  const completeHabit = useCompleteHabit();
  const completedHabits = useMemo(
    () =>
      Array.from(new Set(completions.map((completion) => completion.habit_id))),
    [completions],
  );
  const completedCount = habits.filter((habit) =>
    completedHabits.includes(habit.$id),
  ).length;
  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;
  const firstName = user?.name?.split(" ")[0] || "there";
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const handleRefresh = async () => {
    await Promise.all([refetchHabits(), refetchCompletions()]);
  };
  const handleDeleteHabit = async (id: string) => {
    try {
      await deleteHabit.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCompleteHabit = async (id: string) => {
    if (!user || completedHabits.includes(id)) return;
    try {
      const habit = habits.find((item) => item.$id === id);
      if (habit)
        await completeHabit.mutateAsync({
          habitId: id,
          userId: user.$id,
          habit,
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Good day, {firstName}
            </Text>
            <Text style={[styles.date, { color: colors.muted }]}>
              {todayLabel}
            </Text>
          </View>
          <IconButton
            icon="logout-variant"
            iconColor={colors.muted}
            size={21}
            onPress={signOut}
            accessibilityLabel="Sign out"
            style={[
              styles.signOutButton,
              { backgroundColor: colors.surfaceMuted },
            ]}
          />
        </View>
        <View
          style={[styles.progressCard, { backgroundColor: colors.primary }]}
        >
          <View style={styles.progressCopy}>
            <Text style={[styles.eyebrow, { color: colors.progressSoft }]}>
              TODAY&apos;S PROGRESS
            </Text>
            <Text style={styles.progressTitle}>
              {habits.length === 0
                ? "Start your rhythm"
                : completedCount === habits.length
                  ? "You're all set!"
                  : `${completedCount} of ${habits.length} complete`}
            </Text>
            <Text style={styles.progressSubtitle}>
              {habits.length === 0
                ? "Small actions, repeated daily, create big change."
                : completedCount === habits.length
                  ? "Take a moment to enjoy the win."
                  : "One focused action at a time."}
            </Text>
          </View>
          <View
            style={[
              styles.progressRing,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.progressSoft,
              },
            ]}
          >
            <Text style={styles.progressPercent}>{progress}%</Text>
            <Text style={styles.progressLabel}>DONE</Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your habits
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              Tap a card to mark it complete
            </Text>
          </View>
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={colors.primary}
            iconColor={colors.onPrimary}
            size={20}
            onPress={() => router.push("/add-habit")}
            accessibilityLabel="Add a habit"
          />
        </View>
        <HabitsList
          habits={habits}
          completedHabits={completedHabits}
          onDeleteHabit={handleDeleteHabit}
          onCompleteHabit={handleCompleteHabit}
          onAddHabit={() => router.push("/add-habit")}
          isCompleting={completeHabit.isPending}
        />
        {habits.length > 0 && (
          <View style={styles.hint}>
            <MaterialCommunityIcons
              name="gesture-swipe"
              size={18}
              color={colors.muted}
            />
            <Text style={[styles.hintText, { color: colors.muted }]}>
              Swipe left to delete a habit
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F8FC" },
  content: { paddingHorizontal: 20, paddingBottom: 116 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 24,
  },
  greeting: {
    color: "#242235",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  date: { color: "#858197", fontSize: 14, marginTop: 4 },
  signOutButton: { backgroundColor: "#EFEEF5", margin: 0 },
  progressCard: {
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    padding: 22,
  },
  progressCopy: { flex: 1, paddingRight: 12 },
  eyebrow: {
    color: "#DCD7FF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  progressTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 7,
  },
  progressSubtitle: {
    color: "#E8E5FF",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  progressRing: {
    alignItems: "center",
    backgroundColor: "#8073E9",
    borderColor: "#B8B0FF",
    borderRadius: 42,
    borderWidth: 5,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  progressPercent: { color: "#FFFFFF", fontSize: 19, fontWeight: "800" },
  progressLabel: {
    color: "#E8E5FF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 1,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#242235",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionSubtitle: { color: "#8B879A", fontSize: 13, marginTop: 2 },
  hint: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 3,
  },
  hintText: { color: "#88849B", fontSize: 12, marginLeft: 6 },
});
