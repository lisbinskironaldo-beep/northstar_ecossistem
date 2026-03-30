import { Pressable, Text, View } from 'react-native';
import { palette } from './mobile-ui';

export function HomeLibraryGrid({
  onPress,
}: {
  onPress: (target: 'private' | 'shared' | 'borrowed' | 'published') => void;
}) {
  const items: Array<{
    id: 'private' | 'shared' | 'borrowed' | 'published';
    title: string;
    note: string;
  }> = [
    {
      id: 'private',
      title: 'Privadas',
      note: 'seu acervo fechado',
    },
    {
      id: 'shared',
      title: 'Compartilhadas',
      note: 'listas abertas com outros',
    },
    {
      id: 'borrowed',
      title: 'Emprestadas',
      note: 'albums que vieram do circulo',
    },
    {
      id: 'published',
      title: 'Minhas publicações',
      note: 'o que voce lançou',
    },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onPress(item.id)}
          style={{
            width: '48%',
            minHeight: 132,
            borderRadius: 24,
            padding: 16,
            backgroundColor: 'rgba(10,14,30,0.78)',
            borderWidth: 1,
            borderColor: 'rgba(201,214,255,0.14)',
            justifyContent: 'space-between',
            gap: 12,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: -8,
              width: 52,
              height: 52,
              borderRadius: 999,
              backgroundColor:
                item.id === 'private' || item.id === 'published'
                  ? 'rgba(56,189,248,0.14)'
                  : 'rgba(139,92,246,0.16)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: item.id === 'private' || item.id === 'published' ? palette.neonBlue : palette.neonViolet,
            }}
          />
          <View style={{ gap: 4 }}>
            <Text style={{ color: palette.textOnDark, fontSize: 20, fontWeight: '700' }}>{item.title}</Text>
            <Text style={{ color: palette.mutedOnDark }}>{item.note}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
