import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import HomeScreen from './app/index';
import ExploreScreen from './app/explore';
import UploadScreen from './app/upload';
import ProfileScreen from './app/profile';

type EchoTab = 'feed' | 'explore' | 'upload' | 'profile';

const tabs: Array<{ id: EchoTab; label: string }> = [
  { id: 'feed', label: 'Feed' },
  { id: 'explore', label: 'Explore' },
  { id: 'upload', label: 'Upload' },
  { id: 'profile', label: 'Profile' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<EchoTab>('feed');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: activeTab === tab.id ? '#0f172a' : '#e2e8f0',
            }}
          >
            <Text
              style={{
                color: activeTab === tab.id ? '#f8fafc' : '#0f172a',
                fontWeight: '600',
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'feed' ? <HomeScreen /> : null}
        {activeTab === 'explore' ? <ExploreScreen /> : null}
        {activeTab === 'upload' ? <UploadScreen /> : null}
        {activeTab === 'profile' ? <ProfileScreen /> : null}
      </View>
    </SafeAreaView>
  );
}
