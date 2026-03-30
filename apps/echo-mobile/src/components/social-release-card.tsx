import { Pressable, Text, View } from 'react-native';
import { EchoTrack } from '../lib/api';
import { describeTrackAudioSource, hasPlayableAudio } from '../lib/echo-audio';
import type { FeedEventHint } from '../lib/mobile-social';
import { getReleaseCardTheme } from '../lib/mobile-social';
import { ActionPill, MicroChip, palette } from './mobile-ui';

export function SocialReleaseCard({
  track,
  discoveryLabel,
  onOpenArtist,
  onPreview,
  onSave,
  previewPlaying,
  socialState,
  eventHint,
}: {
  track: EchoTrack;
  discoveryLabel: string;
  onOpenArtist: () => void;
  onPreview: () => void;
  onSave: () => void;
  previewPlaying: boolean;
  socialState: {
    liked: boolean;
    commentCount: number;
    emojiCount: number;
  };
  eventHint: FeedEventHint | null;
}) {
  const audioReady = hasPlayableAudio(track);
  const theme = getReleaseCardTheme(track);
  const audioSource = describeTrackAudioSource(track);

  return (
    <Pressable
      onPress={onOpenArtist}
      style={{
        borderRadius: 26,
        overflow: 'hidden',
        backgroundColor: 'rgba(8,12,24,0.84)',
        borderWidth: 1,
        borderColor: 'rgba(201,214,255,0.16)',
      }}
    >
      <View style={{ height: 3, backgroundColor: theme.borderColor }} />
      <View
        style={{
          minHeight: 260,
          padding: 18,
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          gap: 16,
        }}
      >
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 28,
                backgroundColor: 'rgba(12,18,34,0.98)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: theme.backgroundColor,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 8,
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  backgroundColor: 'rgba(56,189,248,0.22)',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 2,
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: 'rgba(139,92,246,0.24)',
                }}
              />
              <Text style={{ color: palette.textOnDark, fontSize: 34, fontWeight: '800' }}>
                {track.creator.displayName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Text
                  style={{
                    color: theme.eyebrowColor,
                    fontSize: 11,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  lancamento
                </Text>
                {eventHint ? (
                  <Text
                    style={{
                      color: palette.neonBlue,
                      fontSize: 11,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {eventHint.label}
                  </Text>
                ) : null}
              </View>
              <Text style={{ color: palette.textOnDark, fontSize: 24, fontWeight: '800' }} numberOfLines={2}>
                {track.title}
              </Text>
              <Text style={{ color: palette.mutedOnDark, fontSize: 15 }} numberOfLines={1}>
                {track.track?.artistNameDisplay ?? 'artista'} / @{track.creator.handle}
              </Text>
              <Text style={{ color: theme.eyebrowColor, fontSize: 12, fontWeight: '700' }} numberOfLines={1}>
                {discoveryLabel}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <MicroChip label={socialState.liked ? 'curtida sua' : 'sem curtida'} tone="dark" />
            <MicroChip label={`${socialState.commentCount} comentarios`} tone="dark" />
            <MicroChip label={`${socialState.emojiCount} ecos`} tone="dark" />
            <MicroChip label={audioSource.sourceLabel} tone="dark" />
            {eventHint ? <MicroChip label={eventHint.note} tone="warm" /> : null}
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <ActionPill
            label={audioReady ? (previewPlaying ? 'Preview tocando' : 'Play 20s') : 'Audio em preparo'}
            onPress={onPreview}
            active={previewPlaying}
            tone="dark"
          />
          <ActionPill label="Salvar" onPress={onSave} tone="dark" />
        </View>
      </View>
    </Pressable>
  );
}
