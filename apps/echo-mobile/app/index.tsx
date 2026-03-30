import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import {
  EchoCreator,
  EchoTrack,
  FollowedCreatorEntry,
  echoApi,
} from '../src/lib/api';
import {
  GlassCard,
  ScreenScroll,
  SectionIntro,
  palette,
} from '../src/components/mobile-ui';
import { ArtistProfilePanel } from '../src/components/artist-profile-panel';
import { EcosystemHorizonStrip } from '../src/components/ecosystem-horizon-strip';
import { HomeLibraryGrid } from '../src/components/home-library-grid';
import { LiveRoomCard } from '../src/components/live-room-card';
import { LiveRoomPanel } from '../src/components/live-room-panel';
import { PremiereEventCard } from '../src/components/premiere-event-card';
import { SocialReleaseCard } from '../src/components/social-release-card';
import type { useEchoCommunityState } from '../src/lib/use-echo-community-state';
import { buildFeedEventHint, buildLiveRoomCandidates, type LiveRoomCandidate } from '../src/lib/mobile-social';

type ArtistDetailState = {
  creator: EchoCreator;
  selectedTrackId: string;
} | null;
type LiveRoomState = {
  room: LiveRoomCandidate;
} | null;

export default function HomeScreen({
  onOpenProfile,
  activeTrack,
  isActiveTrackPlaying,
  onPauseActiveTrack,
  previewTrackId,
  community,
  onPlayPreview,
  onSelectTrack,
}: {
  onOpenProfile: () => void;
  activeTrack: EchoTrack | null;
  isActiveTrackPlaying: boolean;
  onPauseActiveTrack: () => Promise<void>;
  previewTrackId: string | null;
  community: ReturnType<typeof useEchoCommunityState>;
  onPlayPreview: (track: EchoTrack) => Promise<string>;
  onSelectTrack: (track: EchoTrack) => Promise<void>;
}) {
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [artistDetail, setArtistDetail] = useState<ArtistDetailState>(null);
  const [liveRoomState, setLiveRoomState] = useState<LiveRoomState>(null);
  const [dismissedLiveIds, setDismissedLiveIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const [trackData, creatorData, followedData] = await Promise.all([
          echoApi.getTracks(80),
          echoApi.getCreators().catch(() => []),
          echoApi.getFollowedCreators().catch(() => []),
        ]);

        if (active) {
          setTracks(trackData);
          setCreators(creatorData);
          setFollowedCreators(followedData);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel abrir o feed');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  const followedCreatorIds = useMemo(
    () => new Set(followedCreators.map((entry) => entry.creatorId)),
    [followedCreators],
  );

  const rankedRecentTracks = useMemo(
    () =>
      [...tracks].sort((left, right) => {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }),
    [tracks],
  );

  const publicationTracks = useMemo(() => {
    if (followedCreatorIds.size > 0) {
      return rankedRecentTracks.filter((track) => followedCreatorIds.has(track.creator.id));
    }

    return rankedRecentTracks;
  }, [followedCreatorIds, rankedRecentTracks]);

  const publicationBatch = useMemo(() => publicationTracks.slice(0, 10), [publicationTracks]);
  const premiereBatch = useMemo(
    () =>
      publicationTracks
        .filter((track) =>
          buildFeedEventHint(
            track,
            community.livePlansByCreatorId,
            followedCreatorIds.has(track.creator.id) ? 'following' : 'discover',
          ),
        )
        .slice(0, 4),
    [community.livePlansByCreatorId, followedCreatorIds, publicationTracks],
  );

  const artistTracks = useMemo(() => {
    if (!artistDetail) {
      return [];
    }

    return tracks.filter((track) => track.creator.id === artistDetail.creator.id);
  }, [artistDetail, tracks]);
  const selectedArtistTrack =
    artistTracks.find((track) => track.id === artistDetail?.selectedTrackId) ?? artistTracks[0] ?? null;
  const liveRoomCandidates = useMemo(
    () =>
      buildLiveRoomCandidates({
        creators,
        tracks,
        followedCreatorIds,
        livePlansByCreatorId: community.livePlansByCreatorId,
      })
        .filter((room) => !dismissedLiveIds.includes(room.id))
        .slice(0, 5),
    [community.livePlansByCreatorId, creators, dismissedLiveIds, followedCreatorIds, tracks],
  );
  const activeLiveRoomTrack = useMemo(() => {
    if (!liveRoomState?.room.featuredTrackId) {
      return null;
    }

    return tracks.find((track) => track.id === liveRoomState.room.featuredTrackId) ?? null;
  }, [liveRoomState, tracks]);
  const activeLiveRoomCreator = useMemo(() => {
    if (!liveRoomState) {
      return null;
    }

    return creators.find((creator) => creator.id === liveRoomState.room.creatorId) ?? null;
  }, [creators, liveRoomState]);

  async function saveTrack(contentId: string) {
    try {
      const result = await echoApi.saveTrack(contentId);
      setFeedback(result.alreadySaved ? 'Essa faixa ja estava na sua biblioteca.' : 'Faixa salva.');
    } catch (saveError) {
      setFeedback(saveError instanceof Error ? saveError.message : 'Falha ao salvar.');
    }
  }

  async function followCreator(creatorId: string) {
    try {
      const result = await echoApi.followCreator(creatorId);
      setFeedback(result.alreadyFollowing ? 'Voce ja seguia esse artista.' : 'Artista seguido.');
    } catch (followError) {
      setFeedback(followError instanceof Error ? followError.message : 'Falha ao seguir.');
    }
  }

  async function playFeedPreview(track: EchoTrack) {
    try {
      if (activeTrack && isActiveTrackPlaying) {
        await onPauseActiveTrack();
      }
      const message = await onPlayPreview(track);
      setFeedback(message);
    } catch (playError) {
      setFeedback(playError instanceof Error ? playError.message : 'Nao foi possivel tocar o preview.');
    }
  }

  function openArtistFromTrack(track: EchoTrack) {
    const creator =
      creators.find((entry) => entry.id === track.creator.id) ?? {
        ...track.creator,
        userId: '',
        bio: null,
        creatorStatus: 'active',
        creatorTier: 'core',
        primaryFront: 'echo',
        followerCountCached: track.creator.followerCountCached ?? 0,
        publishedContentCountCached: track.creator.publishedContentCountCached ?? 0,
        createdAt: track.createdAt,
      };

    setArtistDetail({
      creator,
      selectedTrackId: track.id,
    });
  }

  function openArtistFromCreator(creatorId: string, selectedTrackId: string | null) {
    const creator = creators.find((entry) => entry.id === creatorId);
    if (!creator) {
      return;
    }

    setLiveRoomState(null);
    setArtistDetail({
      creator,
      selectedTrackId: selectedTrackId ?? tracks.find((track) => track.creator.id === creator.id)?.id ?? '',
    });
  }

  function refreshUpdates() {
    setFeedback('As estantes detalhadas vao abrir na biblioteca completa em seguida.');
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <ActivityIndicator />
        <Text style={{ color: palette.mutedOnDark }}>Montando o feed...</Text>
      </View>
    );
  }

  return (
    <ScreenScroll tone="dark">
      {artistDetail ? (
        <ArtistProfilePanel
          creator={artistDetail.creator}
          tracks={artistTracks}
          selectedTrackId={selectedArtistTrack?.id ?? artistDetail.selectedTrackId}
          community={community}
          onBack={() => setArtistDetail(null)}
          onFollow={() => {
            void followCreator(artistDetail.creator.id);
          }}
          onSelectTrack={async (track) => {
            setArtistDetail((current) => (current ? { ...current, selectedTrackId: track.id } : current));
            await onSelectTrack(track);
          }}
        />
      ) : (
        <>
          {error ? (
            <GlassCard tone="danger">
              <Text style={{ color: '#881337', fontWeight: '700' }}>Sem conexao com a base</Text>
              <Text style={{ color: '#9f1239' }}>{error}</Text>
            </GlassCard>
          ) : null}

          <View style={{ gap: 12 }}>
            <SectionIntro
              title="Aura agora"
              caption="Rádio, show e drop ao vivo. Seu circulo primeiro."
              tone="dark"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
              {liveRoomCandidates.map((room) => (
                <LiveRoomCard
                  key={room.id}
                  room={room}
                  active={liveRoomState?.room.id === room.id}
                  onOpen={() => setLiveRoomState({ room })}
                />
              ))}
            </ScrollView>
          </View>

          {liveRoomState ? (
            <LiveRoomPanel
              room={liveRoomState.room}
              creator={activeLiveRoomCreator}
              track={activeLiveRoomTrack}
              community={community}
              onCollapse={() => setLiveRoomState(null)}
              onNext={() => {
                const currentIndex = liveRoomCandidates.findIndex((item) => item.id === liveRoomState.room.id);
                const next = liveRoomCandidates[currentIndex + 1] ?? null;
                if (next) {
                  setLiveRoomState({ room: next });
                }
              }}
              onDismiss={() => {
                setDismissedLiveIds((current) => [...current, liveRoomState.room.id]);
                setLiveRoomState(null);
              }}
              onOpenArtist={() =>
                openArtistFromCreator(liveRoomState.room.creatorId, liveRoomState.room.featuredTrackId)
              }
            />
          ) : null}

          {liveRoomCandidates.length === 0 ? (
            <GlassCard tone="dark">
              <Text style={{ color: palette.mutedOnDark }}>
                Ainda sem Aura pronta. Quando alguem abrir sessao, ela aparece aqui.
              </Text>
            </GlassCard>
          ) : null}

          <View style={{ gap: 12 }}>
            <SectionIntro
              title="Estreias de hoje"
              caption="Entradas quentes antes da liberação total."
              tone="dark"
            />
            {premiereBatch.length > 0 ? (
              <View style={{ gap: 12 }}>
                {premiereBatch.map((track) => (
                  <PremiereEventCard
                    key={`premiere-${track.id}`}
                    track={track}
                    eventHint={buildFeedEventHint(
                      track,
                      community.livePlansByCreatorId,
                      followedCreatorIds.has(track.creator.id) ? 'following' : 'discover',
                    )}
                    previewPlaying={previewTrackId === track.id}
                    liked={community.likedTrackIds.includes(track.id)}
                    commentCount={(community.commentsByTrackId[track.id] ?? []).length}
                    discoveryLabel={
                      followedCreatorIds.has(track.creator.id) ? 'estreia no seu circulo' : 'estreia global em destaque'
                    }
                    onOpenArtist={() => openArtistFromTrack(track)}
                    onPreview={() => playFeedPreview(track)}
                    onSave={() => saveTrack(track.id)}
                  />
                ))}
              </View>
            ) : (
              <GlassCard tone="dark">
                <Text style={{ color: palette.mutedOnDark }}>
                  Quando um artista marcar radio, show ou drop, a estreia sobe para esta faixa.
                </Text>
              </GlassCard>
            )}
          </View>

          <SectionIntro
            title="Novas publicações"
            caption="O pulso recente depois do ao vivo e das estreias."
            tone="dark"
          />

          <View style={{ gap: 14 }}>
            {publicationBatch.map((track) => (
              <SocialReleaseCard
                key={track.id}
                track={track}
                discoveryLabel={
                  followedCreatorIds.has(track.creator.id)
                    ? 'nova do seu circulo'
                    : 'recente global para manter o feed vivo'
                }
                onOpenArtist={() => openArtistFromTrack(track)}
                onPreview={() => playFeedPreview(track)}
                onSave={() => saveTrack(track.id)}
                previewPlaying={previewTrackId === track.id}
                eventHint={buildFeedEventHint(
                  track,
                  community.livePlansByCreatorId,
                  followedCreatorIds.has(track.creator.id) ? 'following' : 'discover',
                )}
                socialState={{
                  liked: community.likedTrackIds.includes(track.id),
                  commentCount: (community.commentsByTrackId[track.id] ?? []).length,
                  emojiCount: (community.emojisByTrackId[track.id] ?? []).length,
                }}
              />
            ))}
          </View>

          {publicationBatch.length === 0 ? (
            <GlassCard tone="dark">
              <Text style={{ color: palette.mutedOnDark }}>
                Ainda sem novas publicações prontas para esta tela.
              </Text>
            </GlassCard>
          ) : null}

          {feedback ? (
            <GlassCard tone="dark">
              <Text style={{ color: palette.neonBlue, fontWeight: '700' }}>{feedback}</Text>
            </GlassCard>
          ) : null}

          <View style={{ gap: 12 }}>
            <SectionIntro
              title="Biblioteca"
              caption="O que ja virou seu."
              tone="dark"
            />
            <HomeLibraryGrid
              onPress={(target) => {
                if (target === 'published') {
                  onOpenProfile();
                  return;
                }

                refreshUpdates();
              }}
            />
          </View>

          <EcosystemHorizonStrip mode="listener" />
        </>
      )}
    </ScreenScroll>
  );
}
