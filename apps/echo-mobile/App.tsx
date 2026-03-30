import { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import HomeScreen from './app/index';
import ExploreScreen from './app/explore';
import ProfileScreen from './app/profile';
import { MobilePlayerDock } from './src/components/mobile-player-dock';
import type { EchoTrack } from './src/lib/api';
import { palette } from './src/components/mobile-ui';
import { useEchoAudioPlayer } from './src/lib/use-echo-audio-player';
import { useEchoCommunityState } from './src/lib/use-echo-community-state';

type EchoTab = 'feed' | 'explore' | 'profile';
type EchoMode = 'listener' | 'creator';

const tabs: Array<{ id: EchoTab; icon: string; label: string }> = [
  { id: 'feed', icon: '⌂', label: 'Inicio' },
  { id: 'explore', icon: '⌕', label: 'Buscar' },
  { id: 'profile', icon: '◎', label: 'Perfil' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<EchoTab>('feed');
  const [profileMode, setProfileMode] = useState<EchoMode>('listener');
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const {
    playerTrack,
    playerPlaying,
    previewTrackId,
    hasPreviousTrack,
    hasNextTrack,
    selectTrack,
    toggleMainPlayback,
    pauseMainPlayback,
    playPreview,
    playPreviousTrack,
    playNextTrack,
  } = useEchoAudioPlayer();
  const community = useEchoCommunityState();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.pageDark }}>
      <MobilePlayerDock
        track={playerTrack}
        isPlaying={playerPlaying}
        expanded={playerExpanded}
        onToggleExpanded={() => setPlayerExpanded((current) => !current)}
        onTogglePlayback={toggleMainPlayback}
        onPlayPrevious={playPreviousTrack}
        onPlayNext={playNextTrack}
        hasPreviousTrack={hasPreviousTrack}
        hasNextTrack={hasNextTrack}
      />

      <View style={{ flex: 1 }}>
        {activeTab === 'feed' ? (
          <HomeScreen
            onOpenProfile={() => setActiveTab('profile')}
            activeTrack={playerTrack}
            isActiveTrackPlaying={playerPlaying}
            previewTrackId={previewTrackId}
            community={community}
            onPauseActiveTrack={pauseMainPlayback}
            onPlayPreview={playPreview}
            onSelectTrack={async (track: EchoTrack) => {
              await selectTrack(track);
              setPlayerExpanded(false);
            }}
          />
        ) : null}
        {activeTab === 'explore' ? (
          <ExploreScreen
            community={community}
            onSelectTrack={async (track: EchoTrack) => {
              await selectTrack(track);
              setPlayerExpanded(false);
            }}
          />
        ) : null}
        {activeTab === 'profile' ? (
          <ProfileScreen mode={profileMode} onModeChange={setProfileMode} community={community} />
        ) : null}
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 14,
          backgroundColor: 'rgba(6,8,22,0.96)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            padding: 8,
            borderRadius: 28,
            backgroundColor: 'rgba(9,14,28,0.9)',
            borderWidth: 1,
            borderColor: 'rgba(201,214,255,0.12)',
            shadowColor: '#8b5cf6',
            shadowOpacity: 0.16,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => {
              setActiveTab(tab.id);
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 22,
              backgroundColor: activeTab === tab.id ? 'rgba(17,24,39,0.98)' : 'rgba(12,16,31,0.76)',
              borderWidth: 1,
              borderColor: activeTab === tab.id ? 'rgba(56,189,248,0.34)' : 'rgba(201,214,255,0.1)',
              alignItems: 'center',
              gap: 3,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: activeTab === tab.id ? palette.neonViolet : 'rgba(56,189,248,0.45)',
              }}
            />
            <Text
              style={{
                color: activeTab === tab.id ? '#f8fafc' : palette.textOnDark,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              {tab.icon}
            </Text>
            <Text
              style={{
                color: activeTab === tab.id ? '#f8fafc' : palette.textOnDark,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
