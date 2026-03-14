import AuthScaffold from "@/components/auth/AuthScaffold";
import FormButton from "@/components/forms/FormButton";
import FormTextField from "@/components/forms/FormTextField";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { supabase } from "@/lib/supabase/client";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useSession } from "@/features/auth/providers/SessionProvider";

interface SignUpFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const { signIn } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async ({
    email,
    password,
    name,
    surname,
  }: SignUpFormValues) => {
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          surname: surname.trim(),
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Account creation failed",
        text2: error.message,
        position: "bottom",
      });
      return;
    }

    if (data.session && data.user?.id) {
      signIn(data.user.id);
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "Your family tree is ready.",
        position: "bottom",
      });
      router.replace(appRoutes.authTabsHome);
      return;
    }

    Toast.show({
      type: "success",
      text1: "Check your inbox",
      text2: "Confirm your email, then sign in.",
      position: "bottom",
    });
    router.replace(appRoutes.boardingSignIn);
  };

  return (
    <AuthScaffold
      eyebrow="Create your account"
      title="Join Family Tree"
      subtitle="Set up your private space in a minute."
      description="Your account will own the people and relationships you add, and nobody else can see them."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered?</Text>
          <Link href={appRoutes.boardingSignIn} style={styles.footerLink}>
            Sign in
          </Link>
        </View>
      }
    >
      <Controller
        control={control}
        name="name"
        rules={{ required: "First name is required" }}
        render={({ field: { onChange, value } }) => (
          <FormTextField
            label="First name"
            icon="person-outline"
            value={value}
            onChangeText={onChange}
            placeholder="Alex"
            autoCapitalize="words"
            autoCorrect={false}
            errorText={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="surname"
        rules={{ required: "Surname is required" }}
        render={({ field: { onChange, value } }) => (
          <FormTextField
            label="Surname"
            icon="people-outline"
            value={value}
            onChangeText={onChange}
            placeholder="Carter"
            autoCapitalize="words"
            autoCorrect={false}
            errorText={errors.surname?.message}
          />
        )}
      />

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
            placeholder="Choose a password"
            autoCapitalize="none"
            secureTextEntry
            errorText={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Password confirmation does not match",
        }}
        render={({ field: { onChange, value } }) => (
          <FormTextField
            label="Confirm password"
            icon="checkmark-circle-outline"
            value={value}
            onChangeText={onChange}
            placeholder="Repeat your password"
            autoCapitalize="none"
            secureTextEntry
            errorText={errors.confirmPassword?.message}
          />
        )}
      />

      <FormButton
        label={isSubmitting ? "Creating account..." : "Create account"}
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
