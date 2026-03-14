import { useSession } from "@/features/auth/providers/SessionProvider";
import FormButton from "@/components/forms/FormButton";
import FormTextField from "@/components/forms/FormTextField";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/theme/colors";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

interface ProfileFormValues {
  name: string;
  surname: string;
}

export default function EditProfileScreen() {
  const { session } = useSession();
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

  const fetchProfile = useCallback(async () => {
    if (!session) {
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name, surname")
      .eq("id", session)
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "bottom",
        bottomOffset: 50,
      });
      return;
    }

    reset({
      name: data.name || "",
      surname: data.surname || "",
    });
  }, [reset, session]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (values: ProfileFormValues) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: values.name.trim(),
        surname: values.surname.trim(),
      })
      .eq("id", session)
      .select("name, surname")
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while updating the profile",
        position: "bottom",
        bottomOffset: 100,
        swipeable: true,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `${data.name} ${data.surname} updated successfully`,
      position: "bottom",
      bottomOffset: 100,
      swipeable: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Required" }}
            render={({ field: { onChange, value } }) => (
              <FormTextField
                label="Name"
                icon="person-outline"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your name"
                labelStyle={styles.formLabel}
                inputRowStyle={styles.compactInputRow}
                inputStyle={styles.compactInput}
                errorText={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="surname"
            rules={{ required: "Required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Surname"
                icon="person-outline"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter the surname"
                labelStyle={styles.formLabel}
                inputRowStyle={styles.compactInputRow}
                inputStyle={styles.compactInput}
                errorText={errors.surname?.message}
              />
            )}
          />
        </ScrollView>
        <FormButton
          label="Update"
          onPress={handleSubmit(onSubmit)}
          containerStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    flex: 1,
    flexDirection: "column",
    gap: 20,
    paddingBottom: 27,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.button,
    padding: 10,
  },
  scrollViewContainer: {
    backgroundColor: "#fff",
    gap: 14,
  },
  formLabel: {
    color: "#000000a6",
    fontSize: 17,
    fontWeight: "400",
  },
  compactInputRow: {
    minHeight: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0000003d",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  compactInput: {
    fontSize: 17,
    color: colors.text,
    minHeight: 45,
  },
  saveButton: {
    minHeight: 52,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "400",
  },
});
