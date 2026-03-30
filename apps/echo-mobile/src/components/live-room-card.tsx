import { Pressable, Text, View } from 'react-native';
import type { LiveRoomCandidate } from '../lib/mobile-social';
import { MicroChip, palette } from './mobile-ui';

export function LiveRoomCard({
  room,
  onOpen,
  active = false,
}: {
  room: LiveRoomCandidate;
  onOpen: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={{
        width: 320,
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: active ? 'rgba(9,14,28,0.98)' : 'rgba(8,12,24,0.82)',
        borderWidth: 1,
        borderColor: active ? 'rgba(56,189,248,0.38)' : 'rgba(201,214,255,0.14)',
      }}
    >
      <View style={{ height: 2, backgroundColor: active ? palette.neonViolet : 'rgba(56,189,248,0.48)' }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          minHeight: 82,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            backgroundColor: 'rgba(17,24,39,0.96)',
            borderWidth: 1,
            borderColor: 'rgba(201,214,255,0.14)',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              width: 20,
              height: 20,
              borderRadius: 999,
              backgroundColor: 'rgba(56,189,248,0.16)',
            }}
          />
          <Text style={{ color: palette.textOnDark, fontSize: 18, fontWeight: '700' }}>
            {room.creatorName.slice(0, 1).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <MicroChip label={room.source === 'following' ? 'do seu circulo' : 'global'} tone="dark" />
            <MicroChip label={room.kind} tone="dark" />
            <MicroChip label={room.timingLabel} tone="dark" />
          </View>

          <View style={{ gap: 2 }}>
            <Text style={{ color: palette.textOnDark, fontSize: 16, fontWeight: '800' }} numberOfLines={1}>
              {room.creatorName}
            </Text>
            <Text style={{ color: palette.mutedOnDark }} numberOfLines={1}>
              {room.title}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ color: palette.neonBlue, fontSize: 18 }}>▂▅▃▆</Text>
            <Text style={{ color: palette.mutedOnDark, flex: 1 }} numberOfLines={1}>
              @{room.creatorHandle} · {room.audienceLabel}
            </Text>
            <Text style={{ color: palette.textOnDark, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }}>
              {room.ctaLabel}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
