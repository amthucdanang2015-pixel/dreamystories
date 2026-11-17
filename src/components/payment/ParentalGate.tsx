// ============================================================
// ParentalGate — "Ask a grown-up" check before anything that spends
// money or leaves the app (Apple Kids Category 1.3 / 5.1.4, Google
// Play Families). A multiplication question written in words, typed
// on an on-screen keypad: easy for an adult, hard for a young child.
// Every gated action asks again; nothing is remembered.
// ============================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Delete } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Spacing, TouchTarget, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { PARENTAL_GATE_ENABLED } from '../../constants/iap';
import { Button } from '../ui/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { afterDismissDelay, createAfterDismissQueue } from '../../utils/afterDismiss';

/** Numbers are written as words (in the UI language) so a pre-reader can't just copy digits. */
const DIGIT_WORD_KEYS = [
  'parentalGate.digits.zero',
  'parentalGate.digits.one',
  'parentalGate.digits.two',
  'parentalGate.digits.three',
  'parentalGate.digits.four',
  'parentalGate.digits.five',
  'parentalGate.digits.six',
  'parentalGate.digits.seven',
  'parentalGate.digits.eight',
  'parentalGate.digits.nine',
] as const;

interface Question {
  a: number;
  b: number;
}

function makeQuestion(previous?: Question): Question {
  // 3–9 × 3–9: answers 9–81, never a trivial ×1 / ×2.
  for (;;) {
    const q = { a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) };
    if (!previous || q.a !== previous.a || q.b !== previous.b) return q;
  }
}

interface ParentalGateProps {
  visible: boolean;
  /** Full sentence saying what the grown-up is approving (already translated). */
  reason?: string;
  onPass: () => void;
  onCancel: () => void;
  /** iOS only: called once the modal has fully closed. */
  onDismiss?: () => void;
}

export function ParentalGate({ visible, reason, onPass, onCancel, onDismiss }: ParentalGateProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState<Question>(() => makeQuestion());
  const [entry, setEntry] = useState('');
  const [wrong, setWrong] = useState(false);

  const press = (digit: string) => {
    setWrong(false);
    setEntry((e) => (e.length >= 3 ? e : e + digit));
  };
  const backspace = () => setEntry((e) => e.slice(0, -1));

  const submit = () => {
    if (!entry) return;
    if (Number(entry) === question.a * question.b) {
      onPass();
    } else {
      setWrong(true);
      setEntry('');
      setQuestion((q) => makeQuestion(q));
    }
  };

  const keys = useMemo(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onDismiss={onDismiss}
      statusBarTranslucent
    >
      <ScrollView
        style={styles.scrim}
        contentContainerStyle={[
          styles.scrimContent,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.md },
        ]}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={[type.eyebrow, styles.eyebrow]}>{t('parentalGate.eyebrow')}</Text>
          <Text style={[type.heading, styles.title]} accessibilityRole="header">
            {t('parentalGate.title')}
          </Text>
          <Text style={styles.body}>{reason ?? t('parentalGate.reasonDefault')}</Text>

          <Text style={styles.question} accessibilityLiveRegion="polite">
            {t('parentalGate.question', {
              a: t(DIGIT_WORD_KEYS[question.a]),
              b: t(DIGIT_WORD_KEYS[question.b]),
            })}
          </Text>

          <View
            style={styles.display}
            accessible
            accessibilityLabel={entry ? t('parentalGate.answerA11y', { answer: entry }) : t('parentalGate.noAnswerA11y')}
          >
            <Text style={[styles.displayText, !entry && styles.displayPlaceholder]}>
              {entry || t('parentalGate.placeholder')}
            </Text>
          </View>
          <Text style={styles.wrong} accessibilityLiveRegion="assertive">
            {wrong ? t('parentalGate.wrong') : ' '}
          </Text>

          <View style={styles.pad}>
            {keys.map((k) => (
              <Key key={k} label={k} onPress={() => press(k)} />
            ))}
            <Key label={t('parentalGate.delete')} onPress={backspace} icon={<Delete size={20} color={colors.textSecondary} />} />
            <Key label="0" onPress={() => press('0')} />
            <Key label={t('parentalGate.clear')} onPress={() => setEntry('')} small />
          </View>

          <Button label={t('common.continue')} onPress={submit} disabled={!entry} style={styles.continue} />
          <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
        </View>
      </ScrollView>
    </Modal>
  );
}

function Key({ label, onPress, icon, small }: { label: string; onPress: () => void; icon?: React.ReactNode; small?: boolean }) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
    >
      {icon ?? (
        // Fixed-width keys: digits cap their growth, and a word label ("Xoá hết") shrinks to fit one line.
        <Text
          style={[styles.keyText, small && styles.keySmall]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          maxFontSizeMultiplier={1.6}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

/**
 * `guard(action, reason)` runs `action` only after a grown-up passes the
 * gate. `reason` is a full translated sentence ("To restore purchases,
 * please answer this question."). Render `gate` once in the screen.
 */
export function useParentalGate() {
  // `id` keys the gate so every request gets a new question and empty
  // answer. It stays set while the modal fades out (visible: false), so
  // the same <Modal> instance closes and can report onDismiss.
  const [request, setRequest] = useState<{ reason?: string; id: number; visible: boolean } | null>(null);
  const action = useRef<(() => void) | null>(null);
  const counter = useRef(0);
  const queue = useRef(createAfterDismissQueue({ setTimeout, clearTimeout: (h) => clearTimeout(h as never) })).current;

  useEffect(() => () => queue.cancel(), [queue]);

  const guard = useCallback(
    (next: () => void, reason?: string) => {
      if (!PARENTAL_GATE_ENABLED) {
        next();
        return;
      }
      queue.cancel();
      action.current = next;
      setRequest({ reason, id: ++counter.current, visible: true });
    },
    [queue]
  );

  const close = () => setRequest((r) => (r ? { ...r, visible: false } : r));

  // Run the approved action only once the gate has left the screen: on
  // iOS a share sheet / store sheet presented while this modal is still
  // dismissing is dropped without any error.
  const pass = () => {
    const approved = action.current;
    action.current = null;
    close();
    if (approved) queue.schedule(approved, afterDismissDelay(Platform.OS));
  };

  const cancel = () => {
    action.current = null;
    queue.cancel();
    close();
  };

  const gate = (
    <ParentalGate
      key={request?.id ?? 0}
      visible={!!request?.visible}
      reason={request?.reason}
      onCancel={cancel}
      onPass={pass}
      onDismiss={() => queue.dismissed()}
    />
  );

  return { guard, gate };
}

const KEY_W = 72;

const useStyles = createThemedStyles((t) => ({
  scrim: { flex: 1, backgroundColor: t.colors.scrim },
  // Scrolls on short screens / large text so Continue and Cancel stay reachable.
  scrimContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.gutter,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
    ...t.shadow.card,
  },
  eyebrow: { color: t.colors.textAccent, textAlign: 'center' },
  title: { marginTop: 6, textAlign: 'center' },
  body: { fontSize: Typography.sm, color: t.colors.textSecondary, textAlign: 'center', marginTop: 4, lineHeight: 19 },
  question: {
    fontFamily: Typography.serif,
    fontSize: Typography.lg,
    fontWeight: '700',
    color: t.colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  display: {
    alignSelf: 'stretch',
    minHeight: TouchTarget,
    marginTop: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: { fontSize: Typography.xl, fontWeight: '700', letterSpacing: 4, color: t.colors.textPrimary },
  displayPlaceholder: { fontSize: Typography.sm, fontWeight: '500', letterSpacing: 0, color: t.colors.textMuted },
  wrong: { fontSize: Typography.xs, fontWeight: '600', color: t.colors.error, marginTop: 4, minHeight: 16 },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: KEY_W * 3 + Spacing.sm * 2,
    marginTop: Spacing.xs,
  },
  key: {
    width: KEY_W,
    minHeight: 48,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.lg,
    backgroundColor: t.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: { backgroundColor: t.colors.borderStrong },
  keyText: { fontSize: Typography.lg, fontWeight: '600', color: t.colors.textPrimary },
  keySmall: { fontSize: Typography.sm, color: t.colors.textSecondary },
  continue: { alignSelf: 'stretch', marginTop: Spacing.md },
}));
