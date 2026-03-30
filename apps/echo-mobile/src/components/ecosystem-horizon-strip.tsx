import { Text, View } from 'react-native';
import { getFrontHorizon } from '../lib/mobile-social';
import { palette } from './mobile-ui';

export function EcosystemHorizonStrip({
  mode,
}: {
  mode: 'listener' | 'creator';
}) {
  const fronts = getFrontHorizon(mode);

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: palette.mutedOnDark, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
        novidades
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {fronts.map((front) => (
          <View
            key={front.id}
            style={{
              flex: 1,
              minHeight: 72,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                front.state === 'live'
                  ? 'rgba(56,189,248,0.34)'
                  : front.state === 'horizon'
                    ? 'rgba(201,214,255,0.18)'
                    : 'rgba(201,214,255,0.12)',
              backgroundColor:
                front.state === 'live'
                  ? 'rgba(56,189,248,0.1)'
                  : front.state === 'horizon'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.03)',
              justifyContent: 'center',
              gap: 2,
              opacity: front.state === 'live' ? 1 : 0.72,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 14,
                right: 14,
                height: 2,
                backgroundColor: front.state === 'live' ? palette.neonBlue : 'rgba(201,214,255,0.24)',
              }}
            />
            <Text style={{ color: palette.textOnDark, fontSize: 15, fontWeight: '700' }}>{front.title}</Text>
            <Text style={{ color: palette.mutedOnDark, fontSize: 11 }}>
              {front.state === 'live' ? front.note : 'em breve'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
