import { Pressable, Text, View } from 'react-native';
import { EchoTrack } from '../lib/api';
import { hasPlayableAudio } from '../lib/echo-audio';
import { ActionPill, palette } from './mobile-ui';

export function MobilePlayerDock({
  track,
  isPlaying,
  expanded,
  onToggleExpanded,
  onTogglePlayback,
  onPlayPrevious,
  onPlayNext,
  hasPreviousTrack,
  hasNextTrack,
}: {
  track: EchoTrack | null;
  isPlaying: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onTogglePlayback: () => Promise<string>;
  onPlayPrevious: () => Promise<string>;
  onPlayNext: () => Promise<string>;
  hasPreviousTrack: boolean;
  hasNextTrack: boolean;
}) {
  const audioReady = track ? hasPlayableAudio(track) : false;
  const title = track?.title ?? 'Sua seleção principal';
  const artistLine = track
    ? `${track.track?.artistNameDisplay ?? 'artista'} / @${track.creator.handle}`
    : 'Escolha uma faixa completa para guardar aqui';

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 8 }}>
      <View
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(201,214,255,0.16)',
          backgroundColor: 'rgba(7,11,24,0.82)',
          overflow: 'hidden',
          shadowColor: '#8b5cf6',
          shadowOpacity: 0.16,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
        }}
      >
        <View
          style={{
            height: 2,
            backgroundColor: 'rgba(56,189,248,0.58)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: -18,
            right: 12,
            width: 152,
            height: 98,
            backgroundColor: 'rgba(139,92,246,0.22)',
            opacity: 0.82,
            borderRadius: 999,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -12,
            left: 26,
            width: 110,
            height: 54,
            backgroundColor: 'rgba(56,189,248,0.14)',
            borderRadius: 999,
          }}
        />
        <View style={{ paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <Pressable onPress={onToggleExpanded} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: 'rgba(15,24,44,0.98)',
                  borderWidth: 1,
                  borderColor: 'rgba(201,214,255,0.14)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
                >
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(56,189,248,0.14)',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    right: -6,
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    backgroundColor: 'rgba(139,92,246,0.3)',
                  }}
                />
                <Text style={{ color: palette.textOnDark, fontSize: 20, fontWeight: '800' }}>□</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: palette.neonBlue, fontSize: 10, fontWeight: '700', letterSpacing: 0.9 }}>
                  ouvindo agora
                </Text>
                <Text numberOfLines={1} style={{ color: palette.textOnDark, fontSize: 15, fontWeight: '800' }}>
                  {title}
                </Text>
                <Text numberOfLines={1} style={{ color: palette.mutedOnDark, fontSize: 11 }}>
                  {artistLine}
                </Text>
              </View>
            </View>
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <PlayerMiniButton
              label={isPlaying ? '▌▌' : '▶'}
              disabled={!track || !audioReady}
              onPress={() => {
                void onTogglePlayback();
              }}
              primary
            />
            <Pressable
              onPress={onToggleExpanded}
              style={{
                width: 34,
                height: 46,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: 'rgba(139,92,246,0.62)',
                }}
              />
              <Text style={{ color: palette.textOnDark, fontSize: 18, fontWeight: '800', lineHeight: 18 }}>
                {expanded ? '↗' : '↘'}
              </Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            marginTop: 4,
            height: 2,
            borderRadius: 999,
            backgroundColor: 'rgba(201,214,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: track ? (audioReady ? (isPlaying ? '62%' : '36%') : '18%') : '8%',
              height: '100%',
              backgroundColor: isPlaying ? palette.neonBlue : 'rgba(139,92,246,0.74)',
            }}
          />
        </View>

        {expanded ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            <View
              style={{
                height: 196,
                borderRadius: 30,
                backgroundColor: 'rgba(11,17,31,0.94)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.16)',
                justifyContent: 'flex-end',
                padding: 16,
                gap: 6,
                overflow: 'hidden',
              }}
              >
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 16,
                  width: 132,
                  height: 132,
                  borderRadius: 999,
                  backgroundColor: 'rgba(56,189,248,0.16)',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: palette.neonViolet,
                }}
              />
              <Text style={{ color: palette.neonBlue, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }}>
                SELECAO
              </Text>
              <Text style={{ color: palette.textOnDark, fontSize: 22, fontWeight: '800' }}>
                {title}
              </Text>
              <Text style={{ color: palette.mutedOnDark }}>
                {artistLine}
              </Text>
            </View>
            <Text style={{ color: palette.mutedOnDark }}>
              {track
                ? audioReady
                  ? 'O feed toca so o preview. Aqui fica a faixa completa escolhida por voce.'
                  : 'Essa selecao ja fica guardada, mas o audio real dela ainda nao entrou.'
                : 'Quando voce escolher uma faixa completa, ela fica guardada aqui mesmo enquanto explora o app.'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <ActionPill
                label="Anterior"
                tone="dark"
                onPress={() => {
                  void onPlayPrevious();
                }}
                active={hasPreviousTrack}
              />
              <ActionPill
                label={track ? (isPlaying ? 'Pausar' : 'Tocar') : 'Escolher faixa'}
                tone="dark"
                onPress={() => {
                  void onTogglePlayback();
                }}
              />
              <ActionPill
                label="Proxima"
                tone="dark"
                onPress={() => {
                  void onPlayNext();
                }}
                active={hasNextTrack}
              />
            </View>
          </View>
        ) : null}
        </View>
      </View>
    </View>
  );
}

function PlayerMiniButton({
  label,
  disabled,
  onPress,
  primary = false,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        width: primary ? 56 : 28,
        height: primary ? 56 : 28,
        borderRadius: 999,
        backgroundColor: disabled ? 'rgba(148,163,184,0.16)' : primary ? '#101827' : '#1e293b',
        borderWidth: 1,
        borderColor: disabled ? 'rgba(148,163,184,0.16)' : primary ? 'rgba(56,189,248,0.34)' : '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.55 : 1,
        overflow: 'hidden',
        shadowColor: primary ? '#38bdf8' : 'transparent',
        shadowOpacity: primary ? 0.28 : 0,
        shadowRadius: primary ? 12 : 0,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
      {primary ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: 'rgba(139,92,246,0.82)',
          }}
        />
      ) : null}
      <Text style={{ color: '#f8fafc', fontSize: primary ? 24 : 11, fontWeight: '800' }}>
        {label}
      </Text>
    </Pressable>
  );
}
