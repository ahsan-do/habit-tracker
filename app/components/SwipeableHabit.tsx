import HabitCard from "@/app/components/HabitCard";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

interface SwipeableHabitProps { habit: Habit; isCompleted: boolean; onDelete: (id: string) => void; onComplete: (id: string) => void; isCompleting?: boolean; }

const SwipeableHabit = ({ habit, isCompleted, onDelete, onComplete, isCompleting }: SwipeableHabitProps) => {
  const swipeableRef = useRef<Swipeable | null>(null);
  const renderLeftActions = () => <View style={styles.swipeAction}><MaterialCommunityIcons name="trash-can-outline" size={24} color="#FFFFFF" /><Text style={styles.actionLabel}>Delete</Text></View>;

  return (
    <Swipeable ref={swipeableRef} overshootLeft={false} overshootRight={false} renderLeftActions={renderLeftActions} onSwipeableOpen={(direction) => { if (direction === "left") onDelete(habit.$id); swipeableRef.current?.close(); }}>
      <HabitCard habit={habit} isCompleted={isCompleted} disabled={isCompleting} onComplete={() => onComplete(habit.$id)} />
    </Swipeable>
  );
};

export default SwipeableHabit;

const styles = StyleSheet.create({
  swipeAction: { alignItems: "flex-start", backgroundColor: "#E75B65", borderRadius: 20, flex: 1, justifyContent: "center", marginBottom: 12, paddingLeft: 20 },
  actionLabel: { color: "#FFFFFF", fontSize: 12, fontWeight: "800", marginTop: 2 },
});
