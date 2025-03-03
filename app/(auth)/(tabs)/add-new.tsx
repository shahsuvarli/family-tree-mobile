import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import Toast from "react-native-toast-message";
import AddNewSelection from "@/components/AddNewSelection";
import { supabase } from "@/db";
import { useSession } from "@/app/ctx";
import {
  genderOptions,
  lifeOptions,
  maritalStatusOptions,
} from "@/assets/data/new-person.json";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Option } from "@/types";

export default function HomeScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      birthDate: "",
      gender: 1,
      maritalStatus: 1,
      life: 1,
      notes: "",
    },
  });

  const [date, setDate] = useState<Date>(new Date());

  const { session } = useSession();
  const onSubmit = async (values: any) => {
    // const date = new Date(values.birthDate);
    // const [date, setDate] = useState<string>(
    //   new Date(values.birthDate).toLocaleString()
    // );
    const surname = values.surname ? values.surname[0] : "";
    const initials = values.name[0] + surname;
    const { data, error } = await supabase
      .from("people")
      .insert([
        {
          name: values.name,
          surname: values.surname,
          dob: date,
          gender: values.gender,
          life: values.life,
          marital_status: values.maritalStatus,
          note: values.notes,
          user_id: session,
          initials,
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
    } else {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `${data.name} ${data.surname} added successfully`,
        position: "bottom",
        bottomOffset: 100,
        swipeable: true,
      });
      reset();
      setDate(new Date());
      router.push({
        pathname: "/(auth)/(other)/person",
        params: { id: data.id, name: data.name },
      });
      // Redirect({ href: "/(auth)/(tabs)/home/person",  });
    }
  };
  // const [date, setDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.inputText}>Add new person
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputText}>Name</Text>
                  {errors.name && (
                    <Text style={styles.errorText}>*required.</Text>
                  )}
                </View>

                <View style={styles.inputWithIconContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={styles.iconColor.color}
                  />
                  <TextInput
                    style={styles.inputField}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Name"
                    placeholderTextColor={"#0000005a"}
                  />
                </View>
              </View>
            )}
            name="name"
            rules={{ required: true }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputText}>Surname</Text>
                  {errors.surname && (
                    <Text style={styles.errorText}>*required.</Text>
                  )}
                </View>

                <View style={styles.inputWithIconContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={styles.iconColor.color}
                  />
                  <TextInput
                    style={styles.inputField}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Surname"
                    placeholderTextColor={"#0000005a"}
                  />
                </View>
              </View>
            )}
            name="surname"
            rules={{ required: false }}
          />

          <Controller
            control={control}
            render={() => (
              <View style={styles.inputContainer}>
                <View style={styles.inputLabelContainer}>
                  <Text style={styles.inputText}>Date of birth</Text>
                  {errors.birthDate && (
                    <Text style={styles.errorText}>*required.</Text>
                  )}
                </View>

                <Pressable
                  style={styles.inputWithIconContainer}
                  onPress={toggleCalendar}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={25}
                    color={styles.iconColor.color}
                  />
                  <View style={styles.inputField}>
                    <Text style={styles.dateText}>
                      {date.toLocaleString()}
                      {/* {date ? format(date, "dd MMM yyyy") : "Date of birth"} */}
                    </Text>
                  </View>
                </Pressable>

                {showCalendar && (
                  <View>
                    <RNDateTimePicker
                      testID="dateTimePicker"
                      // is24Hour={true}
                      value={date}
                      onChange={(e: any) => {
                        const d = new Date(e);
                        setDate(d);
                        // setValue("birthDate", d.toISOString().split("T")[0]);
                      }}
                      mode="date"
                      // disabled={true}
                      // onConfirm={toggleCalendar}
                      // onCancel={toggleCalendar}
                      textColor="#fff"
                      style={styles.datePicker}
                    />
                    <View style={styles.datePickerButtonsContainer}>
                      <Pressable
                        style={styles.datePickerButton}
                        onPress={toggleCalendar}
                      >
                        <Text style={styles.datePickerButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        style={styles.datePickerButton}
                        onPress={toggleCalendar}
                      >
                        <Text style={styles.datePickerButtonText}>Done</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}
            name="birthDate"
            rules={{ required: false }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <View style={styles.optionsContainer}>
                  {genderOptions.map((option) => (
                    <AddNewSelection
                      option={option as Option}
                      value={value}
                      onChange={onChange}
                      key={option.id}
                    />
                  ))}
                </View>
              </View>
            )}
            name="gender"
            rules={{ required: true }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <View style={styles.optionsContainer}>
                  {lifeOptions.map((option) => (
                    <AddNewSelection
                      option={option as Option}
                      value={value}
                      onChange={onChange}
                      key={option.id}
                    />
                  ))}
                </View>
              </View>
            )}
            name="life"
            rules={{ required: true }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <View style={styles.optionsContainer}>
                  {maritalStatusOptions.map((option) => (
                    <AddNewSelection
                      option={option as Option}
                      value={value}
                      onChange={onChange}
                      key={option.id}
                    />
                  ))}
                </View>
              </View>
            )}
            name="maritalStatus"
            rules={{ required: true }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputText}>Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Notes"
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={"#0000005a"}
                />
              </View>
            )}
            name="notes"
            rules={{ required: false }}
          />
        </ScrollView>
        <Pressable style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
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
    // paddingBottom: 27,
    // padding: 10,
  },
  scrollViewContainer: {
    backgroundColor: "#fff",
    flexDirection: "column",
    borderRadius: 10,
    gap: 0,
  },
  inputContainer: {
    padding: 7,
    borderRadius: 5,
    flexDirection: "column",
    gap: 10,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputText: {
    color: "#000000a6",
    fontSize: 17,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  inputWithIconContainer: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0000003d",
    borderStyle: "solid",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
  },
  iconColor: {
    color: "#0000005a",
  },
  inputField: {
    fontSize: 17,
    paddingVertical: 10,
    flex: 1,
    height: 45,
  },
  dateText: {
    fontSize: 17,
    paddingVertical: 3,
    color: "#000000a6",
  },
  datePicker: {
    // backgroundColor: "#fff",
    height: 150,
    backgroundColor: "#fff",
    color: "#000",
  },
  datePickerButtonsContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    padding: 10,
  },
  datePickerButton: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 17,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 5,
    flex: 1,
    justifyContent: "space-between",
  },
  notesInput: {
    fontSize: 17,
    height: 100,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0000003d",
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: Colors.button,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
