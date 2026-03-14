import FormButton from "@/components/forms/FormButton";
import FormTextField from "@/components/forms/FormTextField";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { fetchProfile, updateProfile } from "@/features/profile/services/profileService";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileFormValues {
  name: string;
  surname: string;
}

export default function EditProfileScreen() {
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      surname: "",
    },
  });

  const loadProfile = useCallback(async () => {
    if (!session) {
      return;
    }

    const { data, error } = await fetchProfile(session);

    if (error) {
      showErrorToast("Error", error.message, { bottomOffset: 50 });
      return;
    }

    reset({
      name: data.name || "",
      surname: data.surname || "",
    });
  }, [reset, session]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session) return;

    setIsSubmitting(true);

    const { data, error } = await updateProfile(session, {
      name: values.name.trim(),
      surname: values.surname.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      showErrorToast("Error", "An error occurred while updating your profile");
      return;
    }

    showSuccessToast(
      "Success",
      `${data.name} ${data.surname} updated successfully`,
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollViewContainer,
          {
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.main, colors.mainDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroIconWrap}>
            <Ionicons name="create-outline" size={24} color={colors.onMain} />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Update your profile</Text>
            <Text style={styles.heroSubtitle}>
              Keep these details current so your profile stays recognisable
              across your family tree.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.mainContainer}>
          <Text style={styles.sectionEyebrow}>Account details</Text>
          <Text style={styles.sectionTitle}>How your profile appears</Text>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Name"
                icon="person-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Name"
                placeholderTextColor={colors.inkMuted}
                errorText={errors.name?.message}
                containerStyle={styles.field}
                labelStyle={styles.fieldLabel}
                inputRowStyle={styles.fieldInputRow}
              />
            )}
          />
          <Controller
            control={control}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Surname"
                icon="person-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Surname"
                placeholderTextColor={colors.inkMuted}
                errorText={errors.surname?.message}
                containerStyle={styles.field}
                labelStyle={styles.fieldLabel}
                inputRowStyle={styles.fieldInputRow}
              />
            )}
          />
        </View>

        <FormButton
          label={isSubmitting ? "Saving..." : "Save changes"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          containerStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },
  heroCard: {
    borderRadius: 24,
    padding: 16,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 5,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  heroTitle: {
    color: colors.onMain,
    fontSize: 20,
    fontWeight: "800",
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroSubtitle: {
    color: "rgba(255,247,238,0.82)",
    fontSize: 13,
    lineHeight: 18,
  },
  mainContainer: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  sectionEyebrow: {
    color: colors.mainDark,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  field: {
    gap: 10,
  },
  fieldLabel: {
    color: colors.mainDark,
  },
  fieldInputRow: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderWarm,
  },
  saveButton: {
    minHeight: 56,
    borderRadius: 18,
    marginBottom: 8,
    backgroundColor: colors.main,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
