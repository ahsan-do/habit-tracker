import { useAuth } from "@/lib/auth-context";
import { useAppPalette } from "@/lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
  const colors = useAppPalette();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = isSignUp
      ? await signUp(normalizedEmail, password)
      : await signIn(normalizedEmail, password);
    setIsSubmitting(false);
    if (result) setError(result);
  };

  const switchMode = () => {
    setIsSignUp((current) => !current);
    setError(null);
  };
  const heading = isSignUp ? "Start your journey" : "Welcome back";

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.brandMark, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons
              name="sprout"
              size={39}
              color={colors.onPrimary}
            />
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>steadily</Text>
          <Text style={[styles.tagline, { color: colors.muted }]}>
            Tiny actions. Lasting change.
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
            </Text>
            <Text style={[styles.heading, { color: colors.text }]}>
              {heading}
            </Text>
            <Text style={[styles.helper, { color: colors.muted }]}>
              {isSignUp
                ? "Create an account to begin building your rhythm."
                : "Pick up where you left off."}
            </Text>
            <TextInput
              label="Email address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              mode="outlined"
              style={[styles.input, { backgroundColor: colors.input }]}
              outlineStyle={styles.inputOutline}
              editable={!isSubmitting}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              secureTextEntry={!isPasswordVisible}
              textContentType={isSignUp ? "newPassword" : "password"}
              mode="outlined"
              style={[styles.input, { backgroundColor: colors.input }]}
              outlineStyle={styles.inputOutline}
              editable={!isSubmitting}
              onSubmitEditing={handleAuth}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setIsPasswordVisible((visible) => !visible)}
                />
              }
            />
            {error ? (
              <View
                style={[styles.errorBox, { backgroundColor: colors.errorSoft }]}
              >
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={18}
                  color={colors.error}
                />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {error}
                </Text>
              </View>
            ) : null}
            <Button
              mode="contained"
              icon={isSignUp ? "arrow-right" : "login"}
              buttonColor={colors.primary}
              textColor={colors.onPrimary}
              style={styles.submit}
              contentStyle={styles.submitContent}
              onPress={handleAuth}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: colors.muted }]}>
                {isSignUp ? "Already have an account?" : "New to steadily?"}
              </Text>
              <Button
                mode="text"
                compact
                onPress={switchMode}
                disabled={isSubmitting}
                textColor={colors.primary}
              >
                {isSignUp ? "Sign in" : "Create one"}
              </Button>
            </View>
          </View>
          <Text style={[styles.privacy, { color: colors.muted }]}>
            Your habits stay private to your account.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8F8FC", flex: 1 },
  content: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#6C5CE7",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  brand: {
    color: "#29263A",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 11,
  },
  tagline: { color: "#898397", fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EAE7F2",
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 31,
    maxWidth: 430,
    padding: 21,
    width: "100%",
  },
  eyebrow: {
    color: "#7C73C5",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heading: {
    color: "#29263A",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.55,
    marginTop: 8,
  },
  helper: {
    color: "#858197",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 23,
    marginTop: 5,
  },
  input: { backgroundColor: "#FFFFFF", marginBottom: 14 },
  inputOutline: { borderRadius: 13 },
  errorBox: {
    alignItems: "center",
    backgroundColor: "#FFF0F1",
    borderRadius: 10,
    flexDirection: "row",
    marginBottom: 14,
    padding: 11,
  },
  errorText: {
    color: "#B94456",
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    marginLeft: 7,
  },
  submit: { backgroundColor: "#6C5CE7", borderRadius: 14, marginTop: 5 },
  submitContent: { height: 52 },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  switchText: { color: "#817C90", fontSize: 12 },
  privacy: { color: "#9893A6", fontSize: 11, marginTop: 22 },
});
