import { useAuth } from "@/lib/auth-context";
import { useAppPalette } from "@/lib/theme";
import { useCreateHabit } from "@/lib/queries";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const colors = useAppPalette();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const createHabit = useCreateHabit();

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await createHabit.mutateAsync({ user_id: user.$id, title: title.trim(), description: description.trim(), frequency });
      router.replace("/");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "We couldn't create this habit. Please try again.");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primarySoft }]}><MaterialCommunityIcons name="sprout" size={33} color={colors.primary} /></View>
          <Text style={[styles.title, { color: colors.text }]}>Build a new rhythm</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Keep it small and specific. You can always build on it later.</Text>
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subdued }]}>WHAT DO YOU WANT TO DO?</Text>
            <TextInput label="Habit name" placeholder="e.g. Take a 10 minute walk" value={title} onChangeText={setTitle} mode="outlined" style={[styles.input, { backgroundColor: colors.input }]} outlineStyle={styles.inputOutline} autoFocus />
            <Text style={[styles.label, { color: colors.subdued }]}>MAKE IT MEANINGFUL</Text>
            <TextInput label="Why does this matter?" placeholder="A short reminder for future you" value={description} onChangeText={setDescription} mode="outlined" multiline numberOfLines={3} style={[styles.descriptionInput, { backgroundColor: colors.input }]} outlineStyle={styles.inputOutline} />
            <Text style={[styles.label, { color: colors.subdued }]}>HOW OFTEN?</Text>
            <SegmentedButtons value={frequency} onValueChange={(value) => setFrequency(value as Frequency)} buttons={FREQUENCIES.map((item) => ({ value: item, label: item.charAt(0).toUpperCase() + item.slice(1) }))} style={styles.segmented} />
          </View>
          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
          <Button mode="contained" icon="check" buttonColor={colors.primary} textColor={colors.onPrimary} onPress={handleSubmit} disabled={!title.trim() || !description.trim() || createHabit.isPending} loading={createHabit.isPending} contentStyle={styles.submitContent} style={styles.submit}>Create habit</Button>
          <Button mode="text" onPress={() => router.back()} textColor={colors.muted} style={styles.cancel}>Cancel</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F8FC" }, content: { padding: 24, paddingBottom: 48 },
  heroIcon: { alignItems: "center", backgroundColor: "#EFEDFF", borderRadius: 27, height: 54, justifyContent: "center", marginTop: 16, width: 54 },
  title: { color: "#28253A", fontSize: 27, fontWeight: "800", letterSpacing: -0.7, marginTop: 20 }, subtitle: { color: "#858197", fontSize: 14, lineHeight: 21, marginTop: 7 },
  formCard: { backgroundColor: "#FFFFFF", borderColor: "#EAE7F2", borderRadius: 22, borderWidth: 1, marginTop: 28, padding: 18 },
  label: { color: "#817C94", fontSize: 10, fontWeight: "800", letterSpacing: 1.1, marginBottom: 8, marginTop: 3 }, input: { backgroundColor: "#FFFFFF", marginBottom: 20 }, descriptionInput: { backgroundColor: "#FFFFFF", marginBottom: 20, minHeight: 98 }, inputOutline: { borderRadius: 13 }, segmented: { marginBottom: 4 },
  submit: { backgroundColor: "#6C5CE7", borderRadius: 14, marginTop: 20 }, submitContent: { height: 52 }, cancel: { marginTop: 8 }, error: { color: "#C83D50", fontSize: 13, marginTop: 14 },
});
