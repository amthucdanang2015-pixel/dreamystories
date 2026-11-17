// ============================================================
// WordModal Component
// Interactive vocabulary tooltip for Learning Mode
// Displays Vietnamese meaning, phonetics, and pronunciation
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Volume2, X, Sparkles, BookA } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography, Spacing, BorderRadius, ReaderTheme } from '../../constants/theme';
import { ReaderShadow } from './readerShadow';
import { WordDefinition } from '../../data/vocabulary';
import { speechService } from '../../services/speechService';

interface WordModalProps {
  definition: WordDefinition | null;
  onClose: () => void;
  /** Opened from inside the reader: follows the Reading Appearance, not the app's Light/Dark. */
  readerTheme: ReaderTheme;
}

export const WordModal: React.FC<WordModalProps> = ({ definition, onClose, readerTheme: rt }) => {
  const { t } = useTranslation();
  if (!definition) return null;

  const handlePronounce = () => {
    speechService.speak({
      text: definition.word,
      language: 'en-US',
      rate: 0.8,
    });
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={Boolean(definition)}
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: rt.name === 'paper' ? 'rgba(26, 24, 16, 0.65)' : rt.scrim }]} onPress={onClose}>
        <Pressable
          style={[
            styles.modalCard,
            { backgroundColor: rt.surface, borderColor: rt.border },
            rt.pageShadow ? null : styles.noShadow,
          ]}
          onPress={(e) => e.stopPropagation()}>
          {/* Scrolls when the card is taller than the screen (small phones, large text). */}
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <BookA size={20} color={rt.accent} strokeWidth={2} />
              <Text style={[styles.wordTitle, { color: rt.text }]}>{definition.word}</Text>
              <TouchableOpacity
                style={[styles.pronounceBtn, { backgroundColor: rt.highlightBg }]}
                onPress={handlePronounce}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t('wordModal.pronounce', { word: definition.word })}
              >
                <Volume2 size={16} color={rt.accent} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('wordModal.close')}
            >
              <X size={18} color={rt.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Phonetics and Part of Speech */}
          <View style={styles.metaRow}>
            <Text style={[styles.phoneticText, { color: rt.textMuted }]}>{definition.phonetic}</Text>
            <View style={[styles.tag, { backgroundColor: rt.background }]}>
              <Text style={[styles.tagText, { color: rt.textSecondary }]}>{definition.partOfSpeech}</Text>
            </View>
          </View>

          {/* Vietnamese Translation Card */}
          <View style={[styles.meaningCard, { backgroundColor: rt.page, borderColor: rt.pageEdge }]}>
            <Text style={[styles.meaningLabel, { color: rt.accent }]}>{t('wordModal.meaning')}</Text>
            <Text style={[styles.meaningVi, { color: rt.text }]}>{definition.vi}</Text>
          </View>

          {/* Example in Story Context */}
          {definition.exampleEn && (
            <View style={[styles.exampleContainer, { backgroundColor: rt.background }]}>
              <View style={styles.exampleHeader}>
                <Sparkles size={12} color={rt.highlightBar} strokeWidth={2} />
                <Text style={[styles.exampleLabel, { color: rt.textMuted }]}>{t('wordModal.example')}</Text>
              </View>
              <Text style={[styles.exampleEn, { color: rt.text }]}>"{definition.exampleEn}"</Text>
              <Text style={[styles.exampleVi, { color: rt.textSecondary }]}>"{definition.exampleVi}"</Text>
            </View>
          )}

          {/* Dismiss button */}
          <TouchableOpacity
            style={[styles.gotItBtn, { backgroundColor: rt.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.gotItText, { color: rt.onPrimary }]}>{t('wordModal.gotIt')}</Text>
          </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    ...ReaderShadow.card,
  },
  noShadow: { shadowOpacity: 0, elevation: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  wordTitle: {
    flexShrink: 1,
    fontSize: Typography.xl,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  pronounceBtn: {
    padding: 6,
    borderRadius: BorderRadius.pill,
  },
  closeBtn: {
    padding: 6,
    borderRadius: BorderRadius.pill,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  phoneticText: {
    fontSize: Typography.sm,
    fontFamily: Typography.serif,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: Typography.xs - 1,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  meaningCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  meaningLabel: {
    fontSize: Typography.xs - 2,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  meaningVi: {
    fontSize: Typography.lg,
    fontWeight: '700',
  },
  exampleContainer: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  exampleLabel: {
    fontSize: Typography.xs - 2,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  exampleEn: {
    fontSize: Typography.sm,
    fontWeight: '500',
    lineHeight: Typography.sm * 1.5,
    marginBottom: 4,
  },
  exampleVi: {
    fontSize: Typography.xs,
    fontStyle: 'italic',
    lineHeight: Typography.xs * 1.5,
  },
  gotItBtn: {
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItText: {
    fontSize: Typography.base,
    fontWeight: '700',
  },
});

