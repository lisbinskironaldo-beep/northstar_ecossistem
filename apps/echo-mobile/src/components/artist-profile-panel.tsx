import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { EchoCreator, EchoTrack } from '../lib/api';
import type { useEchoCommunityState } from '../lib/use-echo-community-state';
import { buildArtistSignals, buildArtistTimeline } from '../lib/mobile-social';
import { ActionPill, GlassCard, MicroChip, SectionIntro, TinyStatus, palette } from './mobile-ui';

function formatCommentTime(value: string) {
  const createdAt = new Date(value).getTime();
  const deltaMinutes = Math.max(0, Math.round((Date.now() - createdAt) / 60000));

  if (deltaMinutes < 1) {
    return 'agora';
  }

  if (deltaMinutes < 60) {
    return `${deltaMinutes} min`;
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours} h`;
  }

  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays} d`;
}

export function ArtistProfilePanel({
  creator,
  tracks,
  selectedTrackId,
  community,
  onBack,
  onFollow,
  onSelectTrack,
}: {
  creator: EchoCreator;
  tracks: EchoTrack[];
  selectedTrackId: string;
  community: ReturnType<typeof useEchoCommunityState>;
  onBack: () => void;
  onFollow: () => void;
  onSelectTrack: (track: EchoTrack) => void | Promise<void>;
}) {
  const [commentDraft, setCommentDraft] = useState('');
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? tracks[0] ?? null;
  const timeline = useMemo(() => {
    const base = buildArtistTimeline(creator, tracks);
    const custom = community.livePlansByCreatorId[creator.id] ?? [];
    return [
      ...custom.map((item) => ({
        id: item.id,
        title: item.title,
        note: item.note,
        kind: item.mode,
      })),
      ...base,
    ].slice(0, 6);
  }, [community.livePlansByCreatorId, creator, tracks]);
  const signals = buildArtistSignals(creator, tracks);
  const liked = selectedTrack ? community.likedTrackIds.includes(selectedTrack.id) : false;
  const emojis = selectedTrack ? community.emojisByTrackId[selectedTrack.id] ?? [] : [];
  const comments = selectedTrack ? community.commentsByTrackId[selectedTrack.id] ?? [] : [];
  const reminderCount = timeline.filter((item) => community.remindersByItemId.includes(item.id)).length;

  return (
    <View style={{ gap: 16 }}>
      <ActionPill label="Voltar ao feed" onPress={onBack} tone="dark" />

      <GlassCard tone="dark">
        <View style={{ gap: 12 }}>
          <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
            artista
          </Text>
          <Text style={{ color: '#f8fafc', fontSize: 30, fontWeight: '700' }}>{creator.displayName}</Text>
          <Text style={{ color: '#cbd5e1' }}>@{creator.handle}</Text>
          <Text style={{ color: '#cbd5e1' }}>
            {creator.bio || 'Identidade em construcao dentro do ecossistema Echo.'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {signals.map((signal) => (
              <TinyStatus key={signal.id} label={signal.label} value={signal.value} tone="dark" />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <MicroChip label={liked ? 'voce curtiu a faixa' : 'faixa ainda sem sua curtida'} tone="dark" />
            <MicroChip label={`${emojis.length} ecos`} tone="dark" />
            <MicroChip label={`${comments.length} comentarios`} tone="dark" />
            <MicroChip label={`${reminderCount} lembretes`} tone="dark" />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <ActionPill label="Seguir" tone="dark" onPress={onFollow} />
            <ActionPill
              label={liked ? 'Curtido' : 'Curtir'}
              tone="dark"
              active={liked}
              onPress={() => {
                if (selectedTrack) {
                  void community.toggleTrackLike(selectedTrack.id);
                }
              }}
            />
            <ActionPill
              label={`Emoji Echo ${emojis.length > 0 ? emojis.length : ''}`.trim()}
              tone="dark"
              onPress={() => {
                if (selectedTrack) {
                  void community.addTrackEmoji(selectedTrack.id, 'eco');
                }
              }}
            />
            <ActionPill label={`Comentar ${comments.length > 0 ? comments.length : ''}`.trim()} tone="dark" />
          </View>
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title={selectedTrack?.title ?? 'Lançamento em foco'}
          caption="A faixa que te trouxe ate aqui fica em foco, mas seu player principal continua guardado."
          tone="dark"
        />
        <View
          style={{
            minHeight: 210,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.06)',
            padding: 18,
            justifyContent: 'flex-end',
            gap: 6,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: '#97dbb3',
            }}
          />
          <Text style={{ color: palette.neonBlue, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
            em destaque
          </Text>
          <Text style={{ color: palette.textOnDark, fontSize: 26, fontWeight: '700' }}>
            {selectedTrack?.title ?? 'sem destaque'}
          </Text>
          <Text style={{ color: palette.mutedOnDark }}>
            {selectedTrack?.description || 'Esse artista ainda esta abrindo a propria linha.'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <MicroChip label={selectedTrack?.primaryCategory?.displayName ?? 'linha aberta'} tone="dark" />
            <MicroChip label={selectedTrack?.track?.accessRoom ?? 'standard'} tone="dark" />
            <MicroChip label={`${comments.length} comentarios`} tone="dark" />
          </View>
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Lançamentos"
          caption="Lista slim para ouvir por completo sem perder o caminho da descoberta."
          tone="dark"
        />
        <View style={{ gap: 10 }}>
          {tracks.map((track) => (
            <View
              key={track.id}
              style={{
                padding: 14,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: track.id === selectedTrack?.id ? 'rgba(56,189,248,0.34)' : 'rgba(201,214,255,0.14)',
                backgroundColor: track.id === selectedTrack?.id ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.05)',
                gap: 10,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: track.id === selectedTrack?.id ? '#97dbb3' : '#9fd6ff',
                }}
              />
              <View style={{ gap: 4 }}>
                <Text style={{ color: palette.textOnDark, fontSize: 17, fontWeight: '700' }}>{track.title}</Text>
                <Text style={{ color: palette.mutedOnDark, fontSize: 13 }}>
                  {track.primaryCategory?.displayName ?? 'linha aberta'} ·{' '}
                  {track.track?.accessRoom ?? 'standard'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                <ActionPill
                  label={track.id === selectedTrack?.id ? 'Tocando daqui' : 'Ouvir completa'}
                  active={track.id === selectedTrack?.id}
                  onPress={() => {
                    void onSelectTrack(track);
                  }}
                  tone="dark"
                />
                <ActionPill label="Salvar playlist" tone="dark" />
                <ActionPill label="Album emprestado" tone="dark" />
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Reações"
          caption="Pulso curto, vivo e musical. Nada de mural pesado."
          tone="dark"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <MicroChip label={liked ? 'curtida ligada' : 'curtir faixa'} tone={liked ? 'ok' : 'dark'} />
          <MicroChip label={`${emojis.length} ecos`} tone="dark" />
          <MicroChip label={`${comments.length} comentarios`} tone="dark" />
          <MicroChip label={`${reminderCount} lembretes`} tone="warm" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {['eco', 'fogo', 'noite', 'loop'].map((emoji) => (
            <ActionPill
              key={emoji}
              label={emoji}
              onPress={() => {
                if (selectedTrack) {
                  void community.addTrackEmoji(selectedTrack.id, emoji);
                }
              }}
              tone="dark"
            />
          ))}
        </View>
        <TextInput
          placeholder="Comentário curto"
          placeholderTextColor={palette.mutedOnDark}
          value={commentDraft}
          onChangeText={setCommentDraft}
          style={{
            borderWidth: 1,
            borderColor: 'rgba(201,214,255,0.14)',
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: palette.textOnDark,
          }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <ActionPill
            label="Enviar comentario"
            onPress={() => {
              if (selectedTrack) {
                void community.addTrackComment(selectedTrack.id, commentDraft);
                setCommentDraft('');
              }
            }}
            tone="dark"
          />
        </View>
        <View style={{ gap: 8 }}>
          {comments.slice(0, 3).map((comment) => (
            <View
              key={comment.id}
              style={{
                padding: 12,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.12)',
                gap: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#9fd6ff',
                }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <Text style={{ color: palette.neonBlue, fontSize: 12, fontWeight: '700' }}>eco curto</Text>
                <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{formatCommentTime(comment.createdAt)}</Text>
              </View>
              <Text style={{ color: palette.textOnDark }}>{comment.text}</Text>
            </View>
          ))}
          {comments.length === 0 ? <Text style={{ color: palette.mutedOnDark }}>Ainda sem comentários.</Text> : null}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Agenda viva"
          caption="Shows, radios e janelas de drop podem subir no feed sem virar video pesado."
          tone="dark"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <MicroChip label={`${timeline.length} janelas`} tone="dark" />
          <MicroChip label={`${reminderCount} lembretes ligados`} tone="warm" />
          <MicroChip label="radio sem arquivo" tone="dark" />
        </View>
        <View style={{ gap: 10 }}>
          {timeline.map((item) => (
            <View
              key={item.id}
              style={{
                padding: 14,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                gap: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#97dbb3',
                }}
              />
              <Text style={{ color: palette.textOnDark, fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
              <Text style={{ color: palette.mutedOnDark }}>{item.note}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
                <ActionPill
                  label={community.remindersByItemId.includes(item.id) ? 'Lembrete ligado' : 'Me avisa'}
                  active={community.remindersByItemId.includes(item.id)}
                  onPress={() => {
                    void community.toggleReminder(item.id);
                  }}
                  tone="dark"
                />
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Sala ao vivo"
          caption="Audio ao vivo pode entrar aqui depois, com publico, emojis e comentarios curtissimos."
        />
        <Text style={{ color: '#cbd5e1' }}>▂▅▃▆  182 ouvindo · 16 comentarios · 83 ecos</Text>
      </GlassCard>
    </View>
  );
}
