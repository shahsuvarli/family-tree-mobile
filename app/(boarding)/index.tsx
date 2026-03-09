import AuthScaffold from "@/components/auth/AuthScaffold";
import { Colors } from "@/theme/colors";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const BoardingScreen = () => {
  return (
    <AuthScaffold
      eyebrow="Family Tree"
      title="Start your family story"
      subtitle="Create your tree, add relatives, and keep every branch in one place."
      description="Sign in to continue with your existing tree, or create a new account to start building from scratch."
      footer={
        <Text style={styles.footerText}>
          Private by default. Every profile only sees its own family data.
        </Text>
      }
    >
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/(boarding)/sign-up")}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/(boarding)/sign-in")}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
};

export default BoardingScreen;

const styles = StyleSheet.create({
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.button,
    borderRadius: 16,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 16,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(47,79,79,0.18)",
    backgroundColor: Colors.secondaryButton,
  },
  secondaryButtonText: {
    color: Colors.button,
    fontSize: 16,
    fontWeight: "700",
  },
  footerText: {
    color: Colors.text,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
