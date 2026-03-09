import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import FormPressableField from "@/components/forms/FormPressableField";
import FormTextField from "@/components/forms/FormTextField";
import OptionChip from "@/components/forms/OptionChip";
import type { PersonFormValues } from "@/features/people/lib/person-form";
import { colors } from "@/theme/colors";
import type { SelectableOption } from "@/types/ui";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Platform, StyleSheet, Text, View } from "react-native";
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

interface DateFieldProps {
  value?: string;
  errorText?: string;
  date?: Date;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onDateChange: (selectedDate?: Date) => void;
}

function DateField({
  value,
  errorText,
  date,
  showCalendar,
  onToggleCalendar,
  onDateChange,
}: DateFieldProps) {
  if (Platform.OS === "ios") {
    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldLabelRow}>
          <Text style={styles.formLabel}>Date of birth</Text>
          {errorText ? (
            <Text style={styles.fieldErrorText}>{errorText}</Text>
          ) : null}
        </View>

        <View style={styles.iosDateField}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0000005a"
            style={styles.iosDateIcon}
          />
          <View pointerEvents="none" style={styles.iosDateValueOverlay}>
            <Text
              numberOfLines={1}
              style={[
                styles.compactPressableValue,
                !value && styles.datePlaceholder,
              ]}
            >
              {value || "Date of birth"}
            </Text>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={date ?? new Date()}
            onChange={(_event, selectedDate) => {
              onDateChange(selectedDate);
            }}
            mode="date"
            display="compact"
            style={styles.iosDatePicker}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <FormPressableField
        label="Date of birth"
        icon="calendar-outline"
        value={value}
        placeholder="Date of birth"
        onPress={onToggleCalendar}
        labelStyle={styles.formLabel}
        fieldStyle={styles.compactInputRow}
        valueStyle={styles.compactPressableValue}
        errorText={errorText}
      />

      {showCalendar ? (
        <DateTimePicker
          testID="dateTimePicker"
          is24Hour
          value={date ?? new Date()}
          onChange={(_event, selectedDate) => {
            onDateChange(selectedDate);
          }}
          mode="date"
          style={styles.datePicker}
        />
      ) : null}
    </View>
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
          <DateField
            value={value}
            errorText={errors.birthDate?.message}
            date={date}
            showCalendar={showCalendar}
            onToggleCalendar={onToggleCalendar}
            onDateChange={onDateChange}
          />
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
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  fieldErrorText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "600",
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
  compactPressableValue: {
    fontSize: 17,
    lineHeight: 22,
    color: colors.text,
    includeFontPadding: false,
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
  iosDateField: {
    minHeight: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0000003d",
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  iosDateIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  iosDateValueOverlay: {
    position: "absolute",
    top: 0,
    right: 12,
    bottom: 0,
    left: 42,
    justifyContent: "center",
    zIndex: 1,
  },
  iosDatePicker: {
    minHeight: 48,
    width: "100%",
    opacity: 0.02,
  },
  datePlaceholder: {
    color: "#0000005a",
  },
  datePicker: {
    height: 150,
    backgroundColor: "#fff",
    color: "#000",
  },
});
