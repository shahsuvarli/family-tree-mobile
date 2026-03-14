import { useSession } from "@/features/auth/providers/SessionProvider";
import FormButton from "@/components/forms/FormButton";
import PersonFormFields from "@/features/people/components/PersonFormFields";
import {
  buildPersonPayload,
  createPersonFormDefaults,
  PersonFormValues,
} from "@/features/people/lib/person-form";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/theme/colors";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function EditPersonScreen() {
  const { person_id: personId } = useLocalSearchParams<{ person_id: string }>();
  const [date, setDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);
  const { session } = useSession();
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

    const { data, error } = await supabase
      .from("people")
      .select("*")
      .eq("id", personId)
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

    const initialDate = data.birth_date ? new Date(data.birth_date) : undefined;
    setDate(initialDate);
    reset({
      ...createPersonFormDefaults(initialDate),
      name: data.name || "",
      surname: data.surname || "",
      gender: data.gender ?? 1,
      maritalStatus: data.marital_status ?? 1,
      life: data.life ?? 1,
      notes: data.notes || "",
    });
  }, [personId, reset]);

  useEffect(() => {
    void fetchPerson();
  }, [fetchPerson]);

  const toggleCalendar = () => {
    setShowCalendar((currentValue) => !currentValue);
  };

  const handleDateChange = (selectedDate?: Date) => {
    if (!selectedDate) {
      return;
    }

    setDate(selectedDate);
    setValue("birthDate", format(selectedDate, "dd MMM yyyy"));
    if (Platform.OS === "android") {
      setShowCalendar(false);
    }
  };

  const onSubmit = async (values: PersonFormValues) => {
    const { data, error } = await supabase
      .from("people")
      .update(buildPersonPayload(values, date, session))
      .eq("id", personId)
      .select("name, surname")
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while updating the person",
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
          <PersonFormFields
            control={control}
            errors={errors}
            date={date}
            showCalendar={showCalendar}
            onToggleCalendar={toggleCalendar}
            onDateChange={handleDateChange}
          />
        </ScrollView>
      </View>
      <FormButton
        label="Update"
        onPress={handleSubmit(onSubmit)}
        containerStyle={styles.saveButton}
        textStyle={styles.saveButtonText}
      />
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
  saveButton: {
    minHeight: 52,
    borderRadius: 5,
    margin: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "400",
  },
});
