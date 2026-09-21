import { useAppPalette } from "@/lib/theme";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { Surface, Text } from "react-native-paper";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: () => void;
  disabled?: boolean;
}

const HabitCard = ({
  habit,
  isCompleted,
  onComplete,
  disabled,
}: HabitCardProps) => {
  const colors = useAppPalette();
  const frequency =
    habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
  return (
    <Surface
      style={[
        styles.card,
        {
          backgroundColor: isCompleted ? colors.completed : colors.surface,
          borderColor: colors.border,
        },
      ]}
      elevation={0}
    >
      <Pressable
        onPress={onComplete}
        disabled={isCompleted || disabled}
        accessibilityRole="button"
        accessibilityLabel={`Mark ${habit.title} as ${isCompleted ? "completed" : "complete"}`}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !isCompleted && styles.pressed,
        ]}
      >
        <View
          style={[
            styles.checkCircle,
            {
              backgroundColor: isCompleted
                ? colors.primary
                : colors.primarySoft,
              borderColor: colors.primary,
            },
            isCompleted && styles.checkCircleCompleted,
          ]}
        >
          <MaterialCommunityIcons
            name={isCompleted ? "check" : "plus"}
            size={20}
            color={isCompleted ? colors.onPrimary : colors.primary}
          />
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
              isCompleted && [styles.completedText, { color: colors.muted }],
            ]}
            numberOfLines={1}
          >
            {habit.title}
          </Text>
          <Text
            style={[styles.cardDescription, { color: colors.muted }]}
            numberOfLines={2}
          >
            {habit.description}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.streakBadge}>
              <MaterialCommunityIcons name="fire" size={16} color="#F59E0B" />
              <Text style={[styles.streakText, { color: colors.warningMuted }]}>
                {habit.streak_count} day streak
              </Text>
              {typeof habit.freezes_available === "number" && (
                <View style={styles.freezeBadge}>
                  <MaterialCommunityIcons
                    name="snowflake"
                    size={12}
                    color={colors.info ?? "#5B9BD5"}
                  />
                  <Text style={[styles.freezeText, { color: colors.muted }]}>
                    {habit.freezes_available}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.frequencyText, { color: colors.muted }]}>
              {frequency}
            </Text>
          </View>
        </View>
      </Pressable>
    </Surface>
  );
};

export default HabitCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEAF6",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardCompleted: { backgroundColor: "#F8F7FC", borderColor: "#E8E5F0" },
  pressable: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 116,
    padding: 16,
  },
  pressed: { opacity: 0.72 },
  checkCircle: {
    alignItems: "center",
    backgroundColor: "#F1EFFF",
    borderColor: "#BDB5FF",
    borderRadius: 18,
    borderWidth: 1.5,
    height: 36,
    justifyContent: "center",
    marginRight: 14,
    width: 36,
  },
  checkCircleCompleted: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
  cardContent: { flex: 1 },
  cardTitle: {
    color: "#29263A",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.15,
  },
  completedText: { color: "#7C788B", textDecorationLine: "line-through" },
  cardDescription: {
    color: "#858197",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },
  streakBadge: { alignItems: "center", flexDirection: "row" },
  streakText: {
    color: "#9C6916",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  frequencyText: { color: "#77718D", fontSize: 12, fontWeight: "700" },
  freezeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: 8,
  },
  freezeText: { fontSize: 11, fontWeight: "600" },
});
