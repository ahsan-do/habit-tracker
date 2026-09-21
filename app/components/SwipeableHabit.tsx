import HabitCard from "@/app/components/HabitCard";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

interface SwipeableHabitProps {
  habit: Habit;
  isCompleted: boolean;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  isCompleting?: boolean;
}

const SwipeableHabit = ({
  habit,
  isCompleted,
  onDelete,
  onComplete,
  isCompleting,
}: SwipeableHabitProps) => {
  const swipeableRef = useRef<Swipeable | null>(null);
  const router = useRouter();

  const renderLeftActions = () => (
    <View style={styles.deleteAction}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={24}
        color="#FFFFFF"
      />
      <Text style={styles.actionLabel}>Delete</Text>
    </View>
  );
  const renderRightActions = () => (
    <View style={styles.editAction}>
      <MaterialCommunityIcons name="pencil-outline" size={24} color="#FFFFFF" />
      <Text style={styles.actionLabel}>Edit</Text>
    </View>
  );

  const openEdit = () => {
    router.push({
      pathname: "/edit-habit/[id]",
      params: {
        id: habit.$id,
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency,
      },
    });
  };

  return (
    <Swipeable
      ref={swipeableRef}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "left") onDelete(habit.$id);
        if (direction === "right") openEdit();
        swipeableRef.current?.close();
      }}
    >
      <HabitCard
        habit={habit}
        isCompleted={isCompleted}
        disabled={isCompleting}
        onComplete={() => onComplete(habit.$id)}
      />
    </Swipeable>
  );
};

export default SwipeableHabit;

const styles = StyleSheet.create({
  deleteAction: {
    alignItems: "flex-start",
    backgroundColor: "#E75B65",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginBottom: 12,
    paddingLeft: 20,
  },
  editAction: {
    alignItems: "flex-end",
    backgroundColor: "#6C5CE7",
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginBottom: 12,
    paddingRight: 20,
  },
  actionLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
});
