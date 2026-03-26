import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { EchoCategory, SavedTrackEntry, echoApi } from '../src/lib/api';
import { DemoSetupCard } from '../src/components/demo-setup-card';

export default function ExploreScreen() {
  const [categories, setCategories] = useState<EchoCategory[]>([]);
  const [savedTracks, setSavedTracks] = useState<SavedTrackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [categoryData, savedTrackData] = await Promise.all([
          echoApi.getCategories(),
          echoApi.getSavedTracks().catch(() => []),
        ]);

        if (active) {
          setCategories(categoryData);
          setSavedTracks(savedTrackData);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load categories');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Explore</Text>
      <DemoSetupCard
        apiBaseUrl={echoApi.baseUrl}
        demoUserId={echoApi.demoUserId}
        demoCreatorId={echoApi.demoCreatorId}
      />
      {error ? <Text style={{ color: '#b91c1c' }}>{error}</Text> : null}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 8 }}>Saved tracks</Text>
      {savedTracks.length === 0 ? (
        <Text style={{ color: '#52525b' }}>No saved tracks yet for the demo user.</Text>
      ) : null}
      {savedTracks.map((entry) => (
        <View
          key={entry.id}
          style={{
            borderWidth: 1,
            borderColor: '#dbe4ff',
            borderRadius: 16,
            padding: 16,
            backgroundColor: '#f8fbff',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{entry.content.title}</Text>
          <Text style={{ color: '#52525b' }}>
            {entry.content.track?.artistNameDisplay ?? 'Unknown artist'} / @
            {entry.content.creator.handle}
          </Text>
        </View>
      ))}
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 12 }}>Categories</Text>
      {categories.map((category) => (
        <View
          key={category.id}
          style={{
            borderWidth: 1,
            borderColor: '#e4e4e7',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{category.displayName}</Text>
          <Text style={{ color: '#52525b' }}>{category.slug}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
