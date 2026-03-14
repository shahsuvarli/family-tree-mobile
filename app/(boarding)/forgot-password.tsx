import AuthScaffold from "@/components/auth/AuthScaffold";
import FormButton from "@/components/forms/FormButton";
import FormTextField from "@/components/forms/FormTextField";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { supabase } from "@/lib/supabase/client";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface ResetFormValues {
  email: string;
}

export default function ForgotPasswordScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: ResetFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

    setIsSubmitting(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Reset failed",
        text2: error.message,
        position: "bottom",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Reset email sent",
      text2: "Check your inbox for the reset link.",
      position: "bottom",
    });
  };

  return (
    <AuthScaffold
      eyebrow="Password reset"
      title="Reset your password"
      subtitle="We’ll send you a recovery email."
      description="Enter the email address connected to your Family Tree account."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered it?</Text>
          <Link href={appRoutes.boardingSignIn} style={styles.footerLink}>
            Back to sign in
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

      <FormButton
        label={isSubmitting ? "Sending..." : "Send reset email"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  footerText: {
    color: colors.text,
    fontSize: 14,
  },
  footerLink: {
    color: colors.button,
    fontSize: 14,
    fontWeight: "700",
  },
});
