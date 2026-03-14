import FormButton from "@/components/forms/FormButton";
import PersonFormFields from "@/features/people/components/PersonFormFields";
import { useSession } from "@/features/auth/providers/SessionProvider";
import {
  buildPersonPayload,
  createPersonFormDefaults,
  PersonFormValues,
} from "@/features/people/lib/person-form";
import {
  fetchPersonById,
  updatePerson,
} from "@/features/people/services/peopleService";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function EditPersonScreen() {
  const { person_id: personId } = useLocalSearchParams<{ person_id: string }>();
  const [date, setDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useSession();
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PersonFormValues>({
    defaultValues: createPersonFormDefaults(),
  });

  const fetchPerson = useCallback(async () => {
    if (!personId) {
      return;
    }

    try {
      const { data, error } = await fetchPersonById(personId);

      if (error) {
        showErrorToast("Error", error.message, { bottomOffset: 50 });
        return;
      }

      const initialDate = data.birth_date ? new Date(data.birth_date) : undefined;
      setDate(initialDate);
      reset({
        ...createPersonFormDefaults(initialDate),
        name: data.name || "",
        surname: data.surname || "",
        birthDateUnknown: !initialDate,
        gender: data.gender ?? 1,
        maritalStatus: data.marital_status ?? 1,
        life: data.life ?? 1,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Unexpected fetch person error", error);
      showErrorToast("Error", "Something went wrong while loading the person.", {
        bottomOffset: 50,
      });
    }
  }, [personId, reset]);

  useEffect(() => {
    void fetchPerson();
  }, [fetchPerson]);

  const toggleCalendar = () => {
    setShowCalendar((currentValue) => !currentValue);
  };

  const handleDateChange = (selectedDate?: Date) => {
    if (!selectedDate) {
      if (Platform.OS === "android") {
        setShowCalendar(false);
      }
      return;
    }

    setDate(selectedDate);
    setValue("birthDate", format(selectedDate, "dd MMM yyyy"));
    setValue("birthDateUnknown", false);
    if (Platform.OS === "android") {
      setShowCalendar(false);
    }
  };

  const handleBirthDateUnknownChange = (isUnknown: boolean) => {
    setValue("birthDateUnknown", isUnknown);

    if (!isUnknown) {
      return;
    }

    setDate(undefined);
    setValue("birthDate", "");
    setShowCalendar(false);
  };

  const onSubmit = async (values: PersonFormValues) => {
    if (!personId) {
      showErrorToast("Missing person", "We couldn't find this person to update.");
      return;
    }

    if (!userId) {
      showErrorToast("Not signed in", "You need to be signed in to update a person.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await updatePerson(
        personId,
        buildPersonPayload(values, date, userId),
      );

      if (error) {
        showErrorToast("Error", "An error occurred while updating the person");
        return;
      }

      showSuccessToast(
        "Success",
        `${data.name} ${data.surname} updated successfully`,
      );
    } catch (error) {
      console.error("Unexpected update person error", error);
      showErrorToast("Error", "Something went wrong while updating the person.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeAreaView}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollViewContainer,
          {
            paddingBottom: insets.bottom + 120,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.main, colors.mainDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroIconWrap}>
            <Ionicons name="create-outline" size={22} color={colors.onMain} />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Edit person</Text>
            <Text style={styles.heroSubtitle}>
              Refine details and keep this person current in your family tree.
            </Text>
          </View>
        </LinearGradient>

        <PersonFormFields
          control={control}
          errors={errors}
          date={date}
          showCalendar={showCalendar}
          onToggleCalendar={toggleCalendar}
          onDateChange={handleDateChange}
          onBirthDateUnknownChange={handleBirthDateUnknownChange}
        />
      </KeyboardAwareScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <FormButton
          label={isSubmitting ? "Updating..." : "Update person"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
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
    backgroundColor: colors.canvas,
  },
  scrollViewContainer: {
    padding: 16,
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
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: colors.onMain,
    fontSize: 20,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "rgba(255,249,244,0.86)",
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  saveButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: colors.main,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
