import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

export type CrudDialogField = {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
};

type CrudDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  fields: CrudDialogField[];
  values: Record<string, string>;
  submitting?: boolean;
  submitLabel?: string;
  onChange: (name: string, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function CrudDialog({
  visible,
  title,
  description,
  fields,
  values,
  submitting = false,
  submitLabel = 'Save',
  onChange,
  onCancel,
  onSubmit,
}: CrudDialogProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={submitting ? undefined : onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>

          <ScrollView contentContainerStyle={styles.fields} keyboardShouldPersistTaps="handled">
            {fields.map((field) => (
              <View key={field.name} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[styles.input, field.multiline ? styles.multilineInput : null]}
                  value={values[field.name] ?? ''}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.muted}
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize ?? 'sentences'}
                  multiline={field.multiline}
                  editable={!submitting}
                  onChangeText={(value) => onChange(field.name, value)}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={[styles.button, styles.cancelButton, submitting ? styles.disabledButton : null]}
              disabled={submitting}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.button, styles.submitButton, submitting ? styles.disabledButton : null]}
              disabled={submitting}
              onPress={onSubmit}
            >
              <Text style={styles.buttonText}>{submitting ? 'Saving...' : submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.label,
    fontWeight: '900',
  },
  cancelButton: {
    backgroundColor: colors.blueSoft,
  },
  cancelButtonText: {
    color: colors.blueDark,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  dialog: {
    backgroundColor: colors.white,
    borderRadius: 28,
    maxHeight: '88%',
    padding: spacing.lg,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.65,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fields: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blueSoft,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typography.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    color: colors.blueDark,
    fontSize: typography.label,
    fontWeight: '900',
  },
  multilineInput: {
    minHeight: 94,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.blue,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
});
