import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import FormTextField from "@/components/forms/FormTextField";
import OptionChip from "@/components/forms/OptionChip";
import type { PersonFormValues } from "@/features/people/lib/person-form";
import { colors } from "@/theme/colors";
import type { SelectableOption } from "@/types/ui";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  onBirthDateUnknownChange: (isUnknown: boolean) => void;
}

interface OptionGroupProps {
  title: string;
  name: keyof Pick<PersonFormValues, "gender" | "life" | "maritalStatus">;
  control: Control<PersonFormValues>;
  options: SelectableOption[];
}

function FormSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
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
  isUnknown: boolean;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onDateChange: (selectedDate?: Date) => void;
  onBirthDateUnknownChange: (isUnknown: boolean) => void;
}

function UnknownDateToggle({
  isUnknown,
  onChange,
}: {
  isUnknown: boolean;
  onChange: (isUnknown: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isUnknown }}
      onPress={() => onChange(!isUnknown)}
      style={[
        styles.unknownToggle,
        isUnknown && styles.unknownToggleActive,
      ]}
    >
      <Ionicons
        name={isUnknown ? "checkmark-circle" : "ellipse-outline"}
        size={18}
        color={isUnknown ? colors.mainDark : colors.inkMuted}
      />
      <Text
        style={[
          styles.unknownToggleText,
          isUnknown && styles.unknownToggleTextActive,
        ]}
      >
        Don&apos;t know
      </Text>
    </Pressable>
  );
}

function DateField({
  value,
  errorText,
  date,
  isUnknown,
  showCalendar,
  onToggleCalendar,
  onDateChange,
  onBirthDateUnknownChange,
}: DateFieldProps) {
  const displayValue = isUnknown
    ? "Date of birth unknown"
    : value || "Date of birth";

  if (Platform.OS === "ios") {
    return (
      <View style={styles.fieldContainer}>
        <View style={styles.dateHeaderRow}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.formLabel}>Date of birth</Text>
            {errorText ? (
              <Text style={styles.fieldErrorText}>{errorText}</Text>
            ) : null}
          </View>
          <UnknownDateToggle
            isUnknown={isUnknown}
            onChange={onBirthDateUnknownChange}
          />
        </View>

        <View
          style={[
            styles.iosDateField,
            isUnknown && styles.disabledDateField,
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0000005a"
            style={styles.iosDateIcon}
          />
          <View pointerEvents="none" style={styles.iosDateValueOverlay}>
            <View style={styles.dateValueContainer}>
              <Text
                numberOfLines={1}
                style={[
                  styles.compactPressableValue,
                  !value && !isUnknown && styles.datePlaceholder,
                  isUnknown && styles.unknownDateText,
                ]}
              >
                {displayValue}
              </Text>
            </View>
          </View>
          {!isUnknown ? (
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
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.dateHeaderRow}>
        <View style={styles.fieldLabelRow}>
          <Text style={styles.formLabel}>Date of birth</Text>
          {errorText ? (
            <Text style={styles.fieldErrorText}>{errorText}</Text>
          ) : null}
        </View>
        <UnknownDateToggle
          isUnknown={isUnknown}
          onChange={onBirthDateUnknownChange}
        />
      </View>

      {isUnknown ? (
        <View style={[styles.androidDateField, styles.disabledDateField]}>
          <Ionicons name="calendar-outline" size={20} color="#0000005a" />
          <View style={styles.dateValueContainer}>
            <Text
              numberOfLines={1}
              style={[styles.compactPressableValue, styles.unknownDateText]}
            >
              {displayValue}
            </Text>
          </View>
        </View>
      ) : (
        <Pressable style={styles.androidDateField} onPress={onToggleCalendar}>
          <Ionicons name="calendar-outline" size={20} color="#0000005a" />
          <View style={styles.dateValueContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.compactPressableValue,
                !value && styles.datePlaceholder,
              ]}
            >
              {displayValue}
            </Text>
          </View>
        </Pressable>
      )}

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
  onBirthDateUnknownChange,
}: PersonFormFieldsProps) {
  return (
    <View style={styles.container}>
      <FormSection
        eyebrow="Basics"
        title="Who are you adding?"
        description="Start with their name and birth details."
      >
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
              placeholderTextColor={colors.inkMuted}
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
            <Controller
              control={control}
              name="birthDateUnknown"
              render={({ field: { value: isUnknown, onChange } }) => (
                <DateField
                  value={value}
                  errorText={errors.birthDate?.message}
                  date={date}
                  isUnknown={isUnknown}
                  showCalendar={showCalendar}
                  onToggleCalendar={onToggleCalendar}
                  onDateChange={onDateChange}
                  onBirthDateUnknownChange={(nextValue) => {
                    onChange(nextValue);
                    onBirthDateUnknownChange(nextValue);
                  }}
                />
              )}
            />
          )}
        />
      </FormSection>

      <FormSection
        eyebrow="Details"
        title="Profile status"
        description="Choose the options that best describe this person."
      >
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
      </FormSection>

      <FormSection
        eyebrow="Notes"
        title="Add context"
        description="Save details or reminders you want to come back to later."
      >
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
              placeholderTextColor={colors.inkMuted}
              labelStyle={styles.formLabel}
              inputRowStyle={styles.compactNotesRow}
              inputStyle={styles.notesInput}
              multiline
              numberOfLines={4}
            />
          )}
        />
      </FormSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  sectionHeader: {
    gap: 6,
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
  },
  sectionDescription: {
    color: colors.inkMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionContent: {
    gap: 16,
  },
  fieldContainer: {
    gap: 10,
  },
  dateHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    flexWrap: "wrap",
    gap: 10,
  },
  fieldErrorText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "600",
  },
  unknownToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  unknownToggleActive: {
    backgroundColor: colors.mainSoft,
    borderColor: colors.borderWarm,
  },
  unknownToggleText: {
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  unknownToggleTextActive: {
    color: colors.mainDark,
    fontWeight: "700",
  },
  formLabel: {
    color: colors.mainDark,
    fontSize: 14,
    fontWeight: "700",
  },
  compactInputRow: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
  },
  compactInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 42,
  },
  compactPressableValue: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    includeFontPadding: false,
  },
  dateValueContainer: {
    flex: 1,
    justifyContent: "center",
  },
  unknownDateText: {
    color: colors.mainDark,
    fontWeight: "600",
  },
  compactNotesRow: {
    minHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  notesInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 92,
    textAlignVertical: "top",
  },
  groupTitle: {
    color: colors.mainDark,
    fontSize: 14,
    fontWeight: "700",
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  iosDateField: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  androidDateField: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  disabledDateField: {
    opacity: 0.76,
  },
  iosDateIcon: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  iosDateValueOverlay: {
    position: "absolute",
    top: 0,
    right: 12,
    bottom: 0,
    left: 46,
    justifyContent: "center",
    zIndex: 1,
  },
  iosDatePicker: {
    minHeight: 54,
    width: "100%",
    opacity: 0.02,
  },
  datePlaceholder: {
    color: colors.inkMuted,
  },
  datePicker: {
    height: 150,
    backgroundColor: colors.surface,
    color: "#000",
  },
});
