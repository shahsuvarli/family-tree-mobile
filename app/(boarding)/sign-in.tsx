import AuthScaffold from "@/components/auth/AuthScaffold";
import FormButton from "@/components/forms/FormButton";
import FormTextField from "@/components/forms/FormTextField";
import { Colors } from "@/theme/colors";
import { supabase } from "@/lib/supabase/client";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSession } from "../ctx";

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const { signIn } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: SignInFormValues) => {
    setIsSubmitting(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: error.message,
        position: "bottom",
      });
      return;
    }

    if (user?.id) {
      signIn(user.id);
    }

    Toast.show({
      type: "success",
      text1: "Signed in",
      text2: "Your family tree is ready.",
      position: "bottom",
    });

    router.replace("/(auth)/(tabs)/home");
  };

  return (
    <AuthScaffold
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Pick up where you left off."
      description="Use the email and password connected to your Family Tree account."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Need an account?</Text>
          <Link href="/(boarding)/sign-up" style={styles.footerLink}>
            Sign up
          </Link>
        </View>
      }
    >
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Enter a valid email address",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormTextField
            label="Email"
            icon="mail-outline"
            value={value}
            onChangeText={onChange}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            errorText={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <FormTextField
            label="Password"
            icon="lock-closed-outline"
            value={value}
            onChangeText={onChange}
            placeholder="Your password"
            autoCapitalize="none"
            secureTextEntry
            errorText={errors.password?.message}
          />
        )}
      />

      <Link href="/(boarding)/forgot-password" style={styles.resetLink}>
        Forgot your password?
      </Link>

      <FormButton
        label={isSubmitting ? "Signing in..." : "Sign in"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  resetLink: {
    color: Colors.button,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  footerText: {
    color: Colors.text,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.button,
    fontSize: 14,
    fontWeight: "700",
  },
});
