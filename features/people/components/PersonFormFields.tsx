import DateTimePicker from "@react-native-community/datetimepicker";
import FormPressableField from "@/components/forms/FormPressableField";
import FormTextField from "@/components/forms/FormTextField";
import OptionChip from "@/components/forms/OptionChip";
import type { PersonFormValues } from "@/features/people/lib/person-form";
import { colors } from "@/theme/colors";
import type { SelectableOption } from "@/types/ui";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import {
  genderOptions,
  lifeOptions,
  maritalStatusOptions,
} from "@/assets/data/new-person.json";

export type { PersonFormValues } from "@/features/people/lib/person-form";

interface PersonFormFieldsProps {
  control: Control<PersonFormValues>;
  errors: FieldErrors<PersonFormValues>;
  date?: Date;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onDateChange: (selectedDate?: Date) => void;
}

interface OptionGroupProps {
  title: string;
  name: keyof Pick<PersonFormValues, "gender" | "life" | "maritalStatus">;
  control: Control<PersonFormValues>;
  options: SelectableOption[];
}

function OptionGroup({ title, name, control, options }: OptionGroupProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <Text style={styles.groupTitle}>{title}</Text>
          <View style={styles.optionGroup}>
            {options.map((option) => (
              <OptionChip
                option={option}
                value={value}
                onChange={onChange}
                key={option.id}
              />
            ))}
          </View>
        </View>
      )}
    />
  );
}

export default function PersonFormFields({
  control,
  errors,
  date,
  showCalendar,
  onToggleCalendar,
  onDateChange,
}: PersonFormFieldsProps) {
  return (
    <View style={styles.container}>
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
            placeholder="Name"
            placeholderTextColor="#0000005a"
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
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextField
            label="Surname"
            icon="person-outline"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Surname"
            placeholderTextColor="#0000005a"
            labelStyle={styles.formLabel}
            inputRowStyle={styles.compactInputRow}
            inputStyle={styles.compactInput}
            errorText={errors.surname?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { value } }) => (
          <View style={styles.fieldContainer}>
            <FormPressableField
              label="Date of birth"
              icon="calendar-outline"
              value={value}
              placeholder="Date of birth"
              onPress={onToggleCalendar}
              labelStyle={styles.formLabel}
              fieldStyle={styles.compactInputRow}
              valueStyle={styles.compactInput}
              errorText={errors.birthDate?.message}
            />

            {showCalendar ? (
              <View>
                <DateTimePicker
                  testID="dateTimePicker"
                  is24Hour={Platform.OS !== "ios"}
                  value={date ?? new Date()}
                  onChange={(_event, selectedDate) => {
                    onDateChange(selectedDate);
                  }}
                  mode="date"
                  textColor="#fff"
                  style={styles.datePicker}
                />
                {Platform.OS === "ios" ? (
                  <View style={styles.datePickerButtonsContainer}>
                    <Pressable
                      style={styles.datePickerButton}
                      onPress={onToggleCalendar}
                    >
                      <Text style={styles.datePickerButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={styles.datePickerButton}
                      onPress={onToggleCalendar}
                    >
                      <Text style={styles.datePickerButtonText}>Done</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        )}
      />

      <OptionGroup
        control={control}
        name="gender"
        title="Gender"
        options={genderOptions as SelectableOption[]}
      />
      <OptionGroup
        control={control}
        name="life"
        title="Life status"
        options={lifeOptions as SelectableOption[]}
      />
      <OptionGroup
        control={control}
        name="maritalStatus"
        title="Marital status"
        options={maritalStatusOptions as SelectableOption[]}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormTextField
            label="Notes"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Notes"
            placeholderTextColor="#0000005a"
            labelStyle={styles.formLabel}
            inputRowStyle={styles.compactNotesRow}
            inputStyle={styles.notesInput}
            multiline
            numberOfLines={4}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  fieldContainer: {
    gap: 8,
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
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
  },
  compactInput: {
    fontSize: 17,
    color: colors.text,
    minHeight: 45,
  },
  compactNotesRow: {
    minHeight: 112,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0000003d",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  notesInput: {
    fontSize: 17,
    color: colors.text,
    minHeight: 90,
    textAlignVertical: "top",
  },
  groupTitle: {
    color: "#000000a6",
    fontSize: 17,
  },
  optionGroup: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-between",
  },
  datePicker: {
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
});
