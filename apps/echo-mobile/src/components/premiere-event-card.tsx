import { Pressable, Text, View } from 'react-native';
import { EchoTrack } from '../lib/api';
import { hasPlayableAudio } from '../lib/echo-audio';
import type { FeedEventHint } from '../lib/mobile-social';
import { ActionPill, MicroChip, palette } from './mobile-ui';

export function PremiereEventCard({
  track,
  eventHint,
  previewPlaying,
  liked,
  commentCount,
  onOpenArtist,
  onPreview,
  onSave,
  discoveryLabel,
}: {
  track: EchoTrack;
  eventHint: FeedEventHint | null;
  previewPlaying: boolean;
  liked: boolean;
  commentCount: number;
  onOpenArtist: () => void;
  onPreview: () => void;
  onSave: () => void;
  discoveryLabel: string;
}) {
  const audioReady = hasPlayableAudio(track);

  return (
    <Pressable
      onPress={onOpenArtist}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(18,10,34,0.92)',
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.28)',
      }}
    >
      <View style={{ height: 3, backgroundColor: palette.neonViolet }} />
      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View
            style={{
              width: 74,
              height: 74,
              borderRadius: 20,
              backgroundColor: 'rgba(28,18,50,0.98)',
              borderWidth: 1,
              borderColor: 'rgba(196,181,253,0.22)',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: -4,
                width: 34,
                height: 34,
                borderRadius: 999,
                backgroundColor: 'rgba(56,189,248,0.2)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -10,
                left: -6,
                width: 42,
                height: 42,
                borderRadius: 999,
                backgroundColor: 'rgba(139,92,246,0.26)',
              }}
            />
            <Text style={{ color: palette.textOnDark, fontSize: 28, fontWeight: '800' }}>
              {track.creator.displayName.slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <MicroChip label="estreia" tone="dark" />
              {eventHint ? <MicroChip label={eventHint.label} tone="dark" /> : null}
              <MicroChip label="hoje" tone="dark" />
            </View>
            <Text style={{ color: palette.textOnDark, fontSize: 20, fontWeight: '800' }} numberOfLines={2}>
              {track.title}
            </Text>
            <Text style={{ color: palette.mutedOnDark }} numberOfLines={1}>
              {track.track?.artistNameDisplay ?? 'artista'} / @{track.creator.handle}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <MicroChip label={liked ? 'curtida sua' : 'nova para voce'} tone="dark" />
          <MicroChip label={`${commentCount} ecos curtos`} tone="dark" />
          {eventHint ? <MicroChip label={eventHint.note} tone="warm" /> : null}
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ color: palette.neonBlue, fontSize: 12, fontWeight: '700' }} numberOfLines={1}>
            {discoveryLabel}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ActionPill
              label={audioReady ? (previewPlaying ? 'No ar' : 'Entrar') : 'Em preparo'}
              onPress={onPreview}
              active={previewPlaying}
              tone="dark"
            />
            <ActionPill label="Salvar" onPress={onSave} tone="dark" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
