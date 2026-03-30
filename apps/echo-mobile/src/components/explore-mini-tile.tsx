import { Pressable, Text, View } from 'react-native';
import { palette } from './mobile-ui';

export function ExploreMiniTile({
  title,
  note,
  onPress,
  variant = 'mini',
}: {
  title: string;
  note: string;
  onPress?: () => void;
  variant?: 'large' | 'mini';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: variant === 'large' ? '48%' : '31%',
        minHeight: variant === 'large' ? 148 : 118,
        borderRadius: variant === 'large' ? 24 : 18,
        padding: variant === 'large' ? 16 : 12,
        backgroundColor: variant === 'large' ? 'rgba(10,14,30,0.82)' : 'rgba(12,16,31,0.78)',
        borderWidth: 1,
        borderColor: 'rgba(201,214,255,0.14)',
        justifyContent: 'space-between',
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
          height: 4,
          backgroundColor: variant === 'large' ? '#97dbb3' : '#9fd6ff',
        }}
      />
      <View style={{ gap: 6 }}>
        {variant === 'large' ? (
          <Text style={{ color: palette.neonBlue, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
            abrir
          </Text>
        ) : null}
        <Text style={{ color: palette.textOnDark, fontSize: variant === 'large' ? 20 : 15, fontWeight: '700' }}>
          {title}
        </Text>
      </View>
      <Text style={{ color: palette.mutedOnDark, fontSize: variant === 'large' ? 13 : 11 }}>{note}</Text>
    </Pressable>
  );
}
