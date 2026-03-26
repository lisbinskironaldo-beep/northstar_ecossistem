import { Text, View } from 'react-native';

export function DemoSetupCard({
  apiBaseUrl,
  demoUserId,
  demoCreatorId,
  showCreator = false,
}: {
  apiBaseUrl: string;
  demoUserId?: string | null;
  demoCreatorId?: string | null;
  showCreator?: boolean;
}) {
  const userReady = Boolean(demoUserId);
  const creatorReady = Boolean(demoCreatorId);
  const fullyReady = showCreator ? userReady && creatorReady : userReady;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: fullyReady ? '#bbf7d0' : '#fde68a',
        backgroundColor: fullyReady ? '#f0fdf4' : '#fffbeb',
        borderRadius: 16,
        padding: 16,
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Demo Setup</Text>
      <Text style={{ color: '#52525b' }}>API base: {apiBaseUrl}</Text>
      <Text style={{ color: userReady ? '#166534' : '#92400e' }}>
        Demo user: {demoUserId ?? 'missing EXPO_PUBLIC_DEMO_USER_ID'}
      </Text>
      {showCreator ? (
        <Text style={{ color: creatorReady ? '#166534' : '#92400e' }}>
          Demo creator: {demoCreatorId ?? 'missing EXPO_PUBLIC_DEMO_CREATOR_ID'}
        </Text>
      ) : null}
      {!fullyReady ? (
        <View style={{ gap: 4 }}>
          <Text style={{ color: '#92400e' }}>Local setup steps:</Text>
          <Text style={{ color: '#92400e' }}>1. Start PostgreSQL and API locally.</Text>
          <Text style={{ color: '#92400e' }}>2. Run `cmd /c npm run seed:echo:demo`.</Text>
          <Text style={{ color: '#92400e' }}>
            3. Copy the generated IDs into `.env`.
          </Text>
          <Text style={{ color: '#92400e' }}>4. Restart the Echo shell.</Text>
        </View>
      ) : (
        <Text style={{ color: '#166534' }}>
          Demo identities configured. This shell is ready for local action testing.
        </Text>
      )}
    </View>
  );
}
