import { Habit } from "@/types/database.type";
import { useAppPalette } from "@/lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import SwipeableHabit from "./SwipeableHabit";

interface HabitsListProps {
  habits: Habit[];
  completedHabits: string[];
  onDeleteHabit: (id: string) => void;
  onCompleteHabit: (id: string) => void;
  onAddHabit: () => void;
  isCompleting?: boolean;
}

const HabitsList = ({ habits, completedHabits, onDeleteHabit, onCompleteHabit, onAddHabit, isCompleting }: HabitsListProps) => {
  const colors = useAppPalette();
  if (habits.length === 0) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}><MaterialCommunityIcons name="sprout-outline" size={36} color={colors.primary} /></View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your day is waiting</Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>Create a small habit to give today some momentum.</Text>
        <Button mode="contained" icon="plus" buttonColor={colors.primary} textColor={colors.onPrimary} onPress={onAddHabit} contentStyle={styles.buttonContent} style={styles.button}>Create your first habit</Button>
      </View>
    );
  }

  return (
    <View>
      {habits.map((habit) => <SwipeableHabit key={habit.$id} habit={habit} isCompleted={completedHabits.includes(habit.$id)} onDelete={onDeleteHabit} onComplete={onCompleteHabit} isCompleting={isCompleting} />)}
    </View>
  );
};

export default HabitsList;

const styles = StyleSheet.create({
  emptyState: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#EAE7F2", borderRadius: 24, borderStyle: "dashed", borderWidth: 1.5, paddingHorizontal: 28, paddingVertical: 42 },
  emptyIcon: { alignItems: "center", backgroundColor: "#F0EEFF", borderRadius: 28, height: 56, justifyContent: "center", marginBottom: 16, width: 56 },
  emptyTitle: { color: "#28253A", fontSize: 18, fontWeight: "800" }, emptyText: { color: "#858197", fontSize: 13, lineHeight: 20, marginTop: 7, textAlign: "center" },
  button: { backgroundColor: "#6C5CE7", borderRadius: 12, marginTop: 23 }, buttonContent: { height: 46 },
});
