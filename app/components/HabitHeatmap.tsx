import { useAppPalette } from "@/lib/theme";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface HabitHeatmapProps {
  dates: string[]; // ISO completed_at strings
  weeks?: number;
}

const DAY_MS = 86_400_000;

const toDayKey = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
};

const HabitHeatmap = ({ dates, weeks = 18 }: HabitHeatmapProps) => {
  const colors = useAppPalette();
  const completedDays = new Set(dates.map((date) => toDayKey(new Date(date))));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Grid ends on today's week; columns are weeks (Sun–Sat), GitHub-style.
  const totalDays = weeks * 7;
  const gridStart = new Date(today.getTime() - (totalDays - 1) * DAY_MS);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const columns: Date[][] = [];
  let cursor = new Date(gridStart);
  for (let w = 0; w < weeks + 1; w += 1) {
    const column: Date[] = [];
    for (let d = 0; d < 7; d += 1) {
      column.push(new Date(cursor));
      cursor = new Date(cursor.getTime() + DAY_MS);
    }
    columns.push(column);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {columns.map((column, colIndex) => (
            <View key={colIndex} style={styles.column}>
              {column.map((day, rowIndex) => {
                const isFuture = day.getTime() > today.getTime();
                const isCompleted = completedDays.has(day.getTime());
                return (
                  <View
                    key={rowIndex}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: isFuture
                          ? "transparent"
                          : isCompleted
                            ? colors.primary
                            : colors.primarySoft,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.muted }]}>Less</Text>
        <View
          style={[styles.legendCell, { backgroundColor: colors.primarySoft }]}
        />
        <View
          style={[styles.legendCell, { backgroundColor: colors.primary }]}
        />
        <Text style={[styles.legendText, { color: colors.muted }]}>More</Text>
      </View>
    </View>
  );
};

export default HabitHeatmap;

const CELL_SIZE = 11;
const CELL_GAP = 3;

const styles = StyleSheet.create({
  wrapper: { marginTop: 4 },
  grid: { flexDirection: "row" },
  column: { marginRight: CELL_GAP },
  cell: {
    borderRadius: 3,
    height: CELL_SIZE,
    marginBottom: CELL_GAP,
    width: CELL_SIZE,
  },
  legend: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  legendText: { fontSize: 10, fontWeight: "600", marginHorizontal: 4 },
  legendCell: { borderRadius: 2, height: 9, marginHorizontal: 1, width: 9 },
});
