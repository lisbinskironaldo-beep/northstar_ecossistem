import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export const palette = {
  page: '#edf7f3',
  pageDark: '#060816',
  panel: 'rgba(255,255,255,0.72)',
  panelDark: 'rgba(10,14,30,0.74)',
  line: 'rgba(117, 160, 181, 0.36)',
  lineDark: 'rgba(201,214,255,0.18)',
  text: '#0f172a',
  textOnDark: '#e5eefc',
  muted: '#5b677a',
  mutedOnDark: '#9fb0d1',
  accent: '#0f172a',
  accentSoft: '#dff2ff',
  neonBlue: '#38bdf8',
  neonViolet: '#8b5cf6',
  soft: 'rgba(235, 249, 244, 0.88)',
  mint: '#dff6eb',
  sky: '#dff2ff',
  skyDeep: '#9fd6ff',
  mintDeep: '#97dbb3',
  glassGlow: 'rgba(255,255,255,0.45)',
  glassGlowDark: 'rgba(56,189,248,0.18)',
};

export function ScreenScroll({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'dark';
}) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tone === 'dark' ? palette.pageDark : palette.page }}
      contentContainerStyle={{ padding: 20, paddingBottom: 130, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function GlassCard({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'soft' | 'dark' | 'danger' | 'ok';
}) {
  const toneStyle =
    tone === 'dark'
      ? styles.cardDark
      : tone === 'danger'
        ? styles.cardDanger
        : tone === 'ok'
          ? styles.cardOk
          : tone === 'soft'
            ? styles.cardSoft
            : styles.cardDefault;

  const accentStyle =
    tone === 'dark'
      ? styles.accentDark
      : tone === 'danger'
        ? styles.accentDanger
        : tone === 'ok'
          ? styles.accentOk
          : tone === 'soft'
            ? styles.accentSoft
            : styles.accentDefault;

  return (
    <View style={[styles.cardBase, toneStyle]}>
      <View style={[styles.cardAccent, accentStyle]} />
      <View style={styles.glassGlow} />
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

export function SectionIntro({
  title,
  caption,
  tone = 'default',
}: {
  title: string;
  caption?: string;
  tone?: 'default' | 'dark';
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={tone === 'dark' ? styles.titleDark : styles.title}>{title}</Text>
      {caption ? <Text style={tone === 'dark' ? styles.captionDark : styles.caption}>{caption}</Text> : null}
    </View>
  );
}

export function ActionPill({
  label,
  active = false,
  onPress,
  tone = 'default',
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tone?: 'default' | 'dark' | 'soft';
}) {
  const style =
    tone === 'dark'
      ? active
        ? styles.pillDarkActive
        : styles.pillDark
      : tone === 'soft'
        ? active
          ? styles.pillSoftActive
          : styles.pillSoft
        : active
          ? styles.pillActive
          : styles.pill;

  const textStyle =
    tone === 'dark'
      ? styles.pillTextOnDark
      : active
        ? styles.pillTextOnDark
        : styles.pillText;

  return (
    <Pressable onPress={onPress} style={style}>
      <View style={[styles.pillAccent, active ? styles.pillAccentActive : styles.pillAccentIdle]} />
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

export function WorldCard({
  eyebrow,
  title,
  note,
  onPress,
}: {
  eyebrow: string;
  title: string;
  note: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard>
        <View style={{ gap: 8 }}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.caption}>{note}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export function ModeSwitch({
  mode,
  onChange,
}: {
  mode: 'listener' | 'creator';
  onChange: (mode: 'listener' | 'creator') => void;
}) {
  return (
    <View style={styles.modeWrap}>
      <Pressable
        onPress={() => onChange('listener')}
        style={[styles.modeButton, mode === 'listener' ? styles.modeButtonActive : null]}
      >
        <Text style={mode === 'listener' ? styles.modeTextActive : styles.modeText}>
          Ouvinte
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('creator')}
        style={[styles.modeButton, mode === 'creator' ? styles.modeButtonActive : null]}
      >
        <Text style={mode === 'creator' ? styles.modeTextActive : styles.modeText}>
          Profissional
        </Text>
      </Pressable>
    </View>
  );
}

export function TinyStatus({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'dark';
}) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={tone === 'dark' ? styles.eyebrowDark : styles.eyebrow}>{label}</Text>
      <Text style={tone === 'dark' ? styles.smallValueDark : styles.smallValue}>{value}</Text>
    </View>
  );
}

export function MicroChip({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'dark' | 'soft' | 'ok' | 'warm';
}) {
  const chipStyle =
    tone === 'dark'
      ? styles.microChipDark
      : tone === 'soft'
        ? styles.microChipSoft
        : tone === 'ok'
          ? styles.microChipOk
          : tone === 'warm'
            ? styles.microChipWarm
            : styles.microChip;

  const textStyle = tone === 'dark' ? styles.microChipTextDark : styles.microChipText;

  return (
    <View style={chipStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  cardBase: {
    borderRadius: 6,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    padding: 18,
    gap: 10,
    overflow: 'hidden',
  },
  cardDefault: {
    backgroundColor: palette.panel,
    borderColor: palette.line,
  },
  cardSoft: {
    backgroundColor: palette.soft,
    borderColor: palette.line,
  },
  cardDark: {
    backgroundColor: palette.panelDark,
    borderColor: palette.lineDark,
  },
  cardDanger: {
    backgroundColor: 'rgba(255,241,242,0.92)',
    borderColor: '#fda4af',
  },
  cardOk: {
    backgroundColor: 'rgba(240,253,250,0.92)',
    borderColor: '#86efac',
  },
  cardAccent: {
    height: 4,
    marginHorizontal: -18,
    marginTop: -18,
    marginBottom: 14,
  },
  accentDefault: {
    backgroundColor: palette.skyDeep,
  },
  accentSoft: {
    backgroundColor: palette.mintDeep,
  },
  accentDark: {
    backgroundColor: palette.neonBlue,
  },
  accentDanger: {
    backgroundColor: '#fb7185',
  },
  accentOk: {
    backgroundColor: '#4ade80',
  },
  glassGlow: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 96,
    height: 44,
    backgroundColor: palette.glassGlow,
    opacity: 0.24,
    transform: [{ skewX: '-18deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.text,
  },
  titleDark: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.textOnDark,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.muted,
  },
  captionDark: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.mutedOnDark,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#64748b',
  },
  eyebrowDark: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: palette.mutedOnDark,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: palette.line,
    overflow: 'hidden',
  },
  pillActive: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderWidth: 1,
    borderColor: palette.accent,
    overflow: 'hidden',
  },
  pillSoft: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(223,242,255,0.94)',
    borderWidth: 1,
    borderColor: '#b7dbf4',
    overflow: 'hidden',
  },
  pillSoftActive: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(151,219,179,0.32)',
    borderWidth: 1,
    borderColor: '#97dbb3',
    overflow: 'hidden',
  },
  pillDark: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(30,41,59,0.92)',
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  pillDarkActive: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#020617',
    overflow: 'hidden',
  },
  pillAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  pillAccentIdle: {
    backgroundColor: palette.skyDeep,
    opacity: 0.72,
  },
  pillAccentActive: {
    backgroundColor: palette.mintDeep,
  },
  pillText: {
    color: palette.text,
    fontWeight: '600',
  },
  pillTextOnDark: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  modeWrap: {
    flexDirection: 'row',
    gap: 8,
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(10,14,30,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(201,214,255,0.16)',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modeText: {
    color: palette.mutedOnDark,
    fontWeight: '600',
  },
  modeTextActive: {
    color: palette.textOnDark,
    fontWeight: '700',
  },
  smallValue: {
    color: palette.text,
    fontWeight: '600',
  },
  smallValueDark: {
    color: palette.textOnDark,
    fontWeight: '600',
  },
  microChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: palette.line,
  },
  microChipSoft: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(223,242,255,0.94)',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  microChipDark: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  microChipOk: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(223,246,235,0.92)',
    borderWidth: 1,
    borderColor: '#97dbb3',
  },
  microChipWarm: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(223,242,255,0.72)',
    borderWidth: 1,
    borderColor: '#9fd6ff',
  },
  microChipText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  microChipTextDark: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700',
  },
});
