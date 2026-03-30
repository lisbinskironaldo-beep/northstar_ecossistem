import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { EchoCreator, EchoTrack } from '../lib/api';
import type { LiveRoomCandidate } from '../lib/mobile-social';
import type { useEchoCommunityState } from '../lib/use-echo-community-state';
import { ActionPill, GlassCard, MicroChip, SectionIntro, palette } from './mobile-ui';

export function LiveRoomPanel({
  room,
  creator,
  track,
  community,
  onCollapse,
  onNext,
  onDismiss,
  onOpenArtist,
}: {
  room: LiveRoomCandidate;
  creator: EchoCreator | null;
  track: EchoTrack | null;
  community: ReturnType<typeof useEchoCommunityState>;
  onCollapse: () => void;
  onNext: () => void;
  onDismiss: () => void;
  onOpenArtist: () => void;
}) {
  const [commentDraft, setCommentDraft] = useState('');
  const comments = track ? community.commentsByTrackId[track.id] ?? [] : [];
  const emojis = track ? community.emojisByTrackId[track.id] ?? [] : [];

  return (
    <View style={{ gap: 16 }}>
      <GlassCard tone="dark">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <SectionIntro
            title={room.title}
            caption={`@${room.creatorHandle} · ${room.kind} · ${room.audienceLabel}`}
            tone="dark"
          />
          <ActionPill label="Fechar" tone="dark" onPress={onCollapse} />
        </View>
        <View
          style={{
            minHeight: 220,
            borderRadius: 28,
            backgroundColor: 'rgba(16,24,44,0.96)',
            padding: 18,
            justifyContent: 'space-between',
            gap: 14,
            overflow: 'hidden',
          }}
        >
            <View
              style={{
                position: 'absolute',
                top: 12,
                right: 14,
                width: 116,
                height: 116,
                borderRadius: 999,
                backgroundColor: 'rgba(139,92,246,0.16)',
              }}
            />
            <Text style={{ color: palette.mutedOnDark }} numberOfLines={2}>{room.note}</Text>
            <View style={{ gap: 10 }}>
              <Text style={{ color: palette.neonBlue, fontSize: 28, letterSpacing: 2 }}>▂▅▃▆ ▅▂▆▃ ▃▅▂▆</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <MicroChip label={`aura ${room.kind}`} tone="dark" />
                <MicroChip label="sem arquivo" tone="dark" />
                <MicroChip label={room.audienceLabel} tone="dark" />
                <MicroChip label={room.timingLabel} tone="dark" />
              </View>
            </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <ActionPill label="Abrir artista" tone="dark" onPress={onOpenArtist} />
          <ActionPill label="Próxima" tone="dark" onPress={onNext} />
          <ActionPill label="Dispensar" tone="dark" onPress={onDismiss} />
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Pulso ao vivo"
          caption="Interação curta, rápida e musical."
          tone="dark"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <MicroChip label={`${emojis.length} ecos`} tone="dark" />
          <MicroChip label={`${comments.length} comentarios`} tone="dark" />
          <MicroChip label={creator ? creator.displayName : room.creatorName} tone="dark" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {['eco', 'fogo', 'loop', 'noite'].map((emoji) => (
            <ActionPill
              key={emoji}
              label={emoji}
              onPress={() => {
                if (track) {
                  void community.addTrackEmoji(track.id, emoji);
                }
              }}
              tone="dark"
            />
          ))}
        </View>
        <TextInput
          placeholder="Comente a radio"
          placeholderTextColor={palette.mutedOnDark}
          value={commentDraft}
          onChangeText={setCommentDraft}
          style={{
            borderWidth: 1,
            borderColor: 'rgba(201,214,255,0.14)',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: palette.textOnDark,
          }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <ActionPill
            label="Enviar"
            onPress={() => {
              if (track) {
                void community.addTrackComment(track.id, commentDraft);
                setCommentDraft('');
              }
            }}
            tone="dark"
          />
        </View>
        <View style={{ gap: 8 }}>
          {comments.slice(0, 4).map((comment) => (
            <View
              key={comment.id}
              style={{
                padding: 12,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
                overflow: 'hidden',
              }}
            >
              <Text style={{ color: palette.textOnDark }}>{comment.text}</Text>
            </View>
          ))}
          {comments.length === 0 ? <Text style={{ color: palette.mutedOnDark }}>Ainda sem comentários.</Text> : null}
        </View>
      </GlassCard>
    </View>
  );
}
