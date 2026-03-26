import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { EchoCreator, FollowedCreatorEntry, echoApi } from '../src/lib/api';
import { DemoSetupCard } from '../src/components/demo-setup-card';

export default function ProfileScreen() {
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackByCreator, setFeedbackByCreator] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    async function loadCreators() {
      try {
        const [creatorData, followedData] = await Promise.all([
          echoApi.getCreators(),
          echoApi.getFollowedCreators().catch(() => []),
        ]);

        if (active) {
          setCreators(creatorData);
          setFollowedCreators(followedData);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load creators');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCreators();

    return () => {
      active = false;
    };
  }, []);

  async function handleFollow(creatorId: string) {
    try {
      const result = await echoApi.followCreator(creatorId);

      setFeedbackByCreator((current) => ({
        ...current,
        [creatorId]: result.alreadyFollowing
          ? 'Creator ja seguido no shell'
          : 'Follow registrado no shell',
      }));
    } catch (followError) {
      setFeedbackByCreator((current) => ({
        ...current,
        [creatorId]:
          followError instanceof Error
            ? followError.message
            : 'Nao foi possivel seguir o creator',
      }));
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Loading creators...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Creators</Text>
      <DemoSetupCard
        apiBaseUrl={echoApi.baseUrl}
        demoUserId={echoApi.demoUserId}
        demoCreatorId={echoApi.demoCreatorId}
      />
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 8 }}>Followed</Text>
      {followedCreators.length === 0 ? (
        <Text style={{ color: '#52525b' }}>No followed creators yet for the demo user.</Text>
      ) : null}
      {followedCreators.map((entry) => (
        <View
          key={entry.id}
          style={{
            borderWidth: 1,
            borderColor: '#dbe4ff',
            borderRadius: 16,
            padding: 16,
            gap: 4,
            backgroundColor: '#f8fbff',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{entry.creator.displayName}</Text>
          <Text style={{ color: '#52525b' }}>@{entry.creator.handle}</Text>
        </View>
      ))}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 12 }}>All creators</Text>
      {creators.map((creator) => (
        <View
          key={creator.id}
          style={{
            borderWidth: 1,
            borderColor: '#e4e4e7',
            borderRadius: 16,
            padding: 16,
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{creator.displayName}</Text>
          <Text style={{ color: '#52525b' }}>@{creator.handle}</Text>
          <Text style={{ color: '#52525b' }}>
            {creator.followerCountCached} followers / {creator.publishedContentCountCached} items
          </Text>
          <Pressable onPress={() => handleFollow(creator.id)} style={buttonStyle}>
            <Text style={buttonTextStyle}>Seguir</Text>
          </Pressable>
          {feedbackByCreator[creator.id] ? (
            <Text style={{ color: '#0f766e' }}>{feedbackByCreator[creator.id]}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const buttonStyle = {
  alignSelf: 'flex-start' as const,
  backgroundColor: '#111827',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginTop: 8,
};

const buttonTextStyle = {
  color: '#f8fafc',
  fontWeight: '600' as const,
};
