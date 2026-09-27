import { useAppPalette } from "@/lib/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Switch, Text } from "react-native-paper";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

interface ReminderPickerProps {
  enabled: boolean;
  onToggleEnabled: (value: boolean) => void;
  time: Date;
  onChangeTime: (date: Date) => void;
  frequency: string;
  weekday: number; // 0-6
  onChangeWeekday: (day: number) => void;
  dayOfMonth: number; // 1-31
  onChangeDayOfMonth: (day: number) => void;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const ReminderPicker = ({
  enabled,
  onToggleEnabled,
  time,
  onChangeTime,
  frequency,
  weekday,
  onChangeWeekday,
  dayOfMonth,
  onChangeDayOfMonth,
}: ReminderPickerProps) => {
  const colors = useAppPalette();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.rowCopy}>
          <Text style={[styles.label, { color: colors.subdued }]}>
            REMIND ME
          </Text>
          <Text style={[styles.hint, { color: colors.muted }]}>
            Get a nudge so you don&apos;t forget
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggleEnabled}
          color={colors.primary}
        />
      </View>

      {enabled && (
        <View style={styles.detail}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[
              styles.timeButton,
              { borderColor: colors.border, backgroundColor: colors.input },
            ]}
          >
            <Text style={[styles.timeText, { color: colors.text }]}>
              {formatTime(time)}
            </Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selected) => {
                setShowPicker(Platform.OS === "ios");
                if (selected) onChangeTime(selected);
              }}
            />
          )}

          {frequency === "weekly" && (
            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, index) => {
                const active = weekday === index;
                return (
                  <Pressable
                    key={index}
                    onPress={() => onChangeWeekday(index)}
                    style={[
                      styles.weekdayChip,
                      {
                        backgroundColor: active
                          ? colors.primary
                          : colors.primarySoft,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.weekdayText,
                        { color: active ? colors.onPrimary : colors.primary },
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {frequency === "monthly" && (
            <View style={styles.monthlyRow}>
              <Text style={[styles.hint, { color: colors.muted }]}>
                Day of month
              </Text>
              <View style={styles.monthlyStepper}>
                <Pressable
                  onPress={() =>
                    onChangeDayOfMonth(Math.max(1, dayOfMonth - 1))
                  }
                  style={[
                    styles.stepperButton,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Text style={[styles.stepperText, { color: colors.primary }]}>
                    –
                  </Text>
                </Pressable>
                <Text style={[styles.monthlyValue, { color: colors.text }]}>
                  {dayOfMonth}
                </Text>
                <Pressable
                  onPress={() =>
                    onChangeDayOfMonth(Math.min(31, dayOfMonth + 1))
                  }
                  style={[
                    styles.stepperButton,
                    { backgroundColor: colors.primarySoft },
                  ]}
                >
                  <Text style={[styles.stepperText, { color: colors.primary }]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ReminderPicker;

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  rowCopy: { flex: 1, paddingRight: 12 },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  hint: { fontSize: 12 },
  detail: { marginTop: 14 },
  timeButton: {
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 13,
  },
  timeText: { fontSize: 16, fontWeight: "700" },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  weekdayChip: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  weekdayText: { fontSize: 12, fontWeight: "800" },
  monthlyRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  monthlyStepper: { alignItems: "center", flexDirection: "row", gap: 12 },
  stepperButton: {
    alignItems: "center",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  stepperText: { fontSize: 16, fontWeight: "800" },
  monthlyValue: {
    fontSize: 16,
    fontWeight: "800",
    minWidth: 24,
    textAlign: "center",
  },
});
