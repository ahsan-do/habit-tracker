import { useUpdateHabit } from "@/lib/queries";
import { useAppPalette } from "@/lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function EditHabitScreen() {
  const colors = useAppPalette();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    frequency: string;
  }>();

  const [title, setTitle] = useState(params.title ?? "");
  const [description, setDescription] = useState(params.description ?? "");
  const [frequency, setFrequency] = useState<Frequency>(
    (params.frequency as Frequency) ?? "daily",
  );
  const [error, setError] = useState("");
  const updateHabit = useUpdateHabit();

  const handleSubmit = async () => {
    if (!params.id) return;
    try {
      await updateHabit.mutateAsync({
        habitId: params.id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          frequency,
        },
      });
      router.back();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "We couldn't save this habit. Please try again.",
      );
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.heroIcon, { backgroundColor: colors.primarySoft }]}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={30}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Edit habit</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Adjust the details — your streak stays intact.
          </Text>
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.label, { color: colors.subdued }]}>
              WHAT DO YOU WANT TO DO?
            </Text>
            <TextInput
              label="Habit name"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={[styles.input, { backgroundColor: colors.input }]}
              outlineStyle={styles.inputOutline}
              autoFocus
            />
            <Text style={[styles.label, { color: colors.subdued }]}>
              MAKE IT MEANINGFUL
            </Text>
            <TextInput
              label="Why does this matter?"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={[
                styles.descriptionInput,
                { backgroundColor: colors.input },
              ]}
              outlineStyle={styles.inputOutline}
            />
            <Text style={[styles.label, { color: colors.subdued }]}>
              HOW OFTEN?
            </Text>
            <SegmentedButtons
              value={frequency}
              onValueChange={(value) => setFrequency(value as Frequency)}
              buttons={FREQUENCIES.map((item) => ({
                value: item,
                label: item.charAt(0).toUpperCase() + item.slice(1),
              }))}
              style={styles.segmented}
            />
          </View>
          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : null}
          <Button
            mode="contained"
            icon="check"
            buttonColor={colors.primary}
            textColor={colors.onPrimary}
            onPress={handleSubmit}
            disabled={
              !title.trim() || !description.trim() || updateHabit.isPending
            }
            loading={updateHabit.isPending}
            contentStyle={styles.submitContent}
            style={styles.submit}
          >
            Save changes
          </Button>
          <Button
            mode="text"
            onPress={() => router.back()}
            textColor={colors.muted}
            style={styles.cancel}
          >
            Cancel
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  heroIcon: {
    alignItems: "center",
    borderRadius: 27,
    height: 54,
    justifyContent: "center",
    marginTop: 16,
    width: 54,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
    marginTop: 20,
  },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 7 },
  formCard: { borderRadius: 22, borderWidth: 1, marginTop: 28, padding: 18 },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 8,
    marginTop: 3,
  },
  input: { marginBottom: 20 },
  descriptionInput: { marginBottom: 20, minHeight: 98 },
  inputOutline: { borderRadius: 13 },
  segmented: { marginBottom: 4 },
  submit: { borderRadius: 14, marginTop: 20 },
  submitContent: { height: 52 },
  cancel: { marginTop: 8 },
  error: { fontSize: 13, marginTop: 14 },
});
