import React, { forwardRef } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, TextStyle, View } from 'react-native';

// react-native-web draws a browser focus ring; the rounded field is the focus cue instead.
const WEB_NO_OUTLINE = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null;
import { Search, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Typography, TouchTarget } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  onSubmitEditing?: () => void;
}

/** Rounded paper search input with an inline clear button. */
export const SearchField = forwardRef<TextInput, SearchFieldProps>(
  ({ value, onChangeText, placeholder, accessibilityLabel, onSubmitEditing }, ref) => {
    const { t } = useTranslation();
    const { colors, scheme } = useTheme();
    const styles = useStyles();
    return (
      <View style={styles.field}>
        <Search size={18} color={colors.textMuted} strokeWidth={2} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, WEB_NO_OUTLINE]}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          enterKeyHint="search"
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={accessibilityLabel ?? placeholder}
          selectionColor={colors.gold}
          cursorColor={colors.primary}
          keyboardAppearance={scheme}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            style={({ pressed }) => [styles.clear, pressed && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel={t('search.clearText')}
          >
            <View style={styles.clearDisc}>
              <X size={12} color={colors.surface} strokeWidth={3} />
            </View>
          </Pressable>
        ) : null}
      </View>
    );
  }
);
SearchField.displayName = 'SearchField';

const useStyles = createThemedStyles((t) => ({
  field: {
    flex: 1,
    minHeight: TouchTarget + 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 16,
    paddingRight: 4,
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: t.colors.border,
    ...t.shadow.paper,
  },
  input: {
    flex: 1,
    fontSize: Typography.md,
    color: t.colors.textPrimary,
    paddingVertical: 10,
    // Remove the web focus ring; the field itself is the focus affordance.
    outlineWidth: 0,
  },
  clear: { width: TouchTarget, height: TouchTarget, alignItems: 'center', justifyContent: 'center' },
  clearDisc: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: t.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
