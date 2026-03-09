import { useSession } from "@/app/ctx";
import FormButton from "@/components/forms/FormButton";
import PersonFormFields, {
  createPersonFormDefaults,
  PersonFormValues,
} from "@/features/people/components/PersonFormFields";
import { supabase } from "@/lib/supabase/client";
import { router } from "expo-router";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AddPersonScreen() {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const { session } = useSession();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PersonFormValues>({
    defaultValues: createPersonFormDefaults(new Date()),
  });

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
      .insert([
        {
          name: values.name.trim(),
          surname: values.surname.trim(),
          birth_date: date,
          gender: values.gender,
          life: values.life,
          marital_status: values.maritalStatus,
          notes: values.notes.trim(),
          profile_id: session,
        },
      ])
      .select("id, name, surname")
      .single();

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while adding the person",
        position: "bottom",
        bottomOffset: 100,
        swipeable: true,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Success",
      text2: `${data.name} ${data.surname} added successfully`,
      position: "bottom",
      bottomOffset: 100,
      swipeable: true,
    });

    const nextDate = new Date();
    setDate(nextDate);
    setShowCalendar(false);
    reset(createPersonFormDefaults(nextDate));
    router.push({
      pathname: "/(auth)/(other)/person",
      params: { id: data.id, name: data.name },
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Add new person</Text>
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
        <FormButton
          label="Save"
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
    borderRadius: 10,
    margin: 10,
    flex: 1,
    flexDirection: "column",
    gap: 20,
  },
  title: {
    color: "#000000a6",
    fontSize: 20,
  },
  scrollViewContainer: {
    backgroundColor: "#fff",
    gap: 14,
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
