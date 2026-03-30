import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { EchoCreator, EchoTrack, FollowedCreatorEntry, echoApi } from '../src/lib/api';
import {
  searchCategoryEntries,
  searchIntentEntries,
} from '../src/lib/mobile-experience';
import { GlassCard, ScreenScroll, SectionIntro, palette } from '../src/components/mobile-ui';
import { ExploreMiniTile } from '../src/components/explore-mini-tile';
import { ArtistProfilePanel } from '../src/components/artist-profile-panel';
import type { useEchoCommunityState } from '../src/lib/use-echo-community-state';
import { buildFeedEventHint, buildLiveRoomCandidates } from '../src/lib/mobile-social';

type ExploreEntry = 'home' | 'artists' | 'categories' | 'live';
type ArtistDetailState = {
  creator: EchoCreator;
  selectedTrackId: string;
} | null;
type SearchIntentId = (typeof searchIntentEntries)[number]['id'];

type DiscoveryRow = {
  id: string;
  title: string;
  note: string;
  eyebrow: string;
  accentColor: string;
  onPress: () => void;
};

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function buildTrackSearchText(track: EchoTrack) {
  return normalizeText(
    `${track.title} ${track.description ?? ''} ${track.track?.artistNameDisplay ?? ''} ${track.creator.displayName} ${track.primaryCategory?.displayName ?? ''} ${track.track?.accessRoom ?? ''}`,
  );
}

export default function ExploreScreen({
  community,
  onSelectTrack,
}: {
  community: ReturnType<typeof useEchoCommunityState>;
  onSelectTrack: (track: EchoTrack) => Promise<void>;
}) {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<ExploreEntry>('home');
  const [activeIntentId, setActiveIntentId] = useState<SearchIntentId | null>(null);
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artistDetail, setArtistDetail] = useState<ArtistDetailState>(null);
  const normalizedQuery = normalizeText(query);

  useEffect(() => {
    let active = true;

    async function loadExplore() {
      try {
        const [trackData, creatorData, followedData] = await Promise.all([
          echoApi.getTracks(80),
          echoApi.getCreators(),
          echoApi.getFollowedCreators().catch(() => []),
        ]);

        if (!active) {
          return;
        }

        setTracks(trackData);
        setCreators(creatorData);
        setFollowedCreators(followedData);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir a busca');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadExplore();

    return () => {
      active = false;
    };
  }, []);

  const followedCreatorIds = useMemo(
    () => new Set(followedCreators.map((entry) => entry.creatorId)),
    [followedCreators],
  );

  const visibleArtistList = useMemo(() => {
    const followed = creators.filter((creator) => followedCreatorIds.has(creator.id));
    return followed.length > 0 ? followed : creators.slice(0, 12);
  }, [creators, followedCreatorIds]);

  const liveCandidates = useMemo(
    () =>
      buildLiveRoomCandidates({
        creators,
        tracks,
        followedCreatorIds,
        livePlansByCreatorId: community.livePlansByCreatorId,
      }),
    [community.livePlansByCreatorId, creators, followedCreatorIds, tracks],
  );

  const liveCreatorList = useMemo(() => {
    if (liveCandidates.length > 0) {
      return liveCandidates.slice(0, 8);
    }

    return creators
      .filter((creator) => (community.livePlansByCreatorId[creator.id] ?? []).length > 0)
      .slice(0, 8)
      .map((creator) => ({
        id: `${creator.id}-fallback-live`,
        creatorId: creator.id,
        creatorName: creator.displayName,
        creatorHandle: creator.handle,
        title: `${creator.displayName} em movimento`,
        note: 'atividade leve pronta para entrar no Aura',
        source: followedCreatorIds.has(creator.id) ? 'following' : 'global',
      }));
  }, [community.livePlansByCreatorId, creators, followedCreatorIds, liveCandidates]);

  function openArtistFromCreator(creator: EchoCreator) {
    const selectedTrackId = tracks.find((track) => track.creator.id === creator.id)?.id ?? '';
    setArtistDetail({ creator, selectedTrackId });
  }

  function openArtistFromTrack(track: EchoTrack) {
    const creator = creators.find((entry) => entry.id === track.creator.id) ?? {
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
    setArtistDetail({ creator, selectedTrackId: track.id });
  }

  const artistTracks = useMemo(() => {
    if (!artistDetail) {
      return [];
    }

    return tracks.filter((track) => track.creator.id === artistDetail.creator.id);
  }, [artistDetail, tracks]);

  const selectedArtistTrack =
    artistTracks.find((track) => track.id === artistDetail?.selectedTrackId) ?? artistTracks[0] ?? null;

  const activeIntentRows = useMemo<DiscoveryRow[]>(() => {
    if (!activeIntentId) {
      return [];
    }

    switch (activeIntentId) {
      case 'small-artists':
        return [...creators]
          .sort((left, right) => (left.followerCountCached ?? 0) - (right.followerCountCached ?? 0))
          .slice(0, 8)
          .map((creator) => ({
            id: creator.id,
            title: creator.displayName,
            note: `@${creator.handle} · ${Math.max(3, creator.followerCountCached ?? 0)} no circulo agora`,
            eyebrow: 'cedo',
            accentColor: '#9fd6ff',
            onPress: () => openArtistFromCreator(creator),
          }));
      case 'live-now':
        return liveCandidates.slice(0, 8).map((room) => ({
          id: room.id,
          title: room.creatorName,
          note: `${room.kind} · ${room.source === 'following' ? 'no seu circulo' : 'global'} · ${room.timingLabel}`,
          eyebrow: 'aura',
          accentColor: '#8b5cf6',
          onPress: () => {
            const creator = creators.find((entry) => entry.id === room.creatorId);
            if (creator) {
              openArtistFromCreator(creator);
            }
          },
        }));
      case 'premiere-today':
        return tracks
          .filter((track) => buildFeedEventHint(track, community.livePlansByCreatorId, followedCreatorIds.has(track.creator.id) ? 'following' : 'discover'))
          .slice(0, 8)
          .map((track) => {
            const eventHint = buildFeedEventHint(
              track,
              community.livePlansByCreatorId,
              followedCreatorIds.has(track.creator.id) ? 'following' : 'discover',
            );
            return {
              id: track.id,
              title: track.title,
              note: `${track.creator.displayName} · ${eventHint?.note ?? 'estreia em aquecimento'}`,
              eyebrow: 'estreia',
              accentColor: '#ff5ca8',
              onPress: () => openArtistFromTrack(track),
            };
          });
      case 'circle': {
        const circleCreators = creators.filter((creator) => followedCreatorIds.has(creator.id)).slice(0, 8);
        return circleCreators.map((creator) => ({
          id: creator.id,
          title: creator.displayName,
          note: `@${creator.handle} · perto do seu pulso agora`,
          eyebrow: 'circulo',
          accentColor: '#67d6a3',
          onPress: () => openArtistFromCreator(creator),
        }));
      }
      case 'dark':
        return tracks
          .filter((track) => {
            const text = buildTrackSearchText(track);
            return text.includes('dark') || text.includes('noite') || text.includes('sombr') || text.includes('frio');
          })
          .slice(0, 8)
          .map((track) => ({
            id: track.id,
            title: track.title,
            note: `${track.creator.displayName} · clima denso para quem quer entrar mais fundo`,
            eyebrow: 'dark',
            accentColor: '#8e5cff',
            onPress: () => openArtistFromTrack(track),
          }));
      case 'night':
        return tracks
          .filter((track) => buildTrackSearchText(track).includes('noite'))
          .slice(0, 8)
          .map((track) => ({
            id: track.id,
            title: track.title,
            note: `${track.creator.displayName} · camada noturna em giro`,
            eyebrow: 'noite',
            accentColor: '#5e7bff',
            onPress: () => openArtistFromTrack(track),
          }));
      case 'training':
        return tracks
          .filter((track) => {
            const text = buildTrackSearchText(track);
            return text.includes('treino') || text.includes('crossfit') || text.includes('cardio');
          })
          .slice(0, 8)
          .map((track) => ({
            id: track.id,
            title: track.title,
            note: `${track.creator.displayName} · energia de subida e repeticao`,
            eyebrow: 'treino',
            accentColor: '#37b8ff',
            onPress: () => openArtistFromTrack(track),
          }));
      case 'experimental':
        return tracks
          .filter((track) => {
            const text = buildTrackSearchText(track);
            return text.includes('experimental') || text.includes('clone') || text.includes('restricted');
          })
          .slice(0, 8)
          .map((track) => ({
            id: track.id,
            title: track.title,
            note: `${track.creator.displayName} · saida menos obvia para abrir outro lado do feed`,
            eyebrow: 'risco',
            accentColor: '#9b6dff',
            onPress: () => openArtistFromTrack(track),
          }));
      case 'rising-fast':
        return [...creators]
          .sort((left, right) => {
            const leftScore = (left.followerCountCached ?? 0) * 3 + (left.publishedContentCountCached ?? 0);
            const rightScore = (right.followerCountCached ?? 0) * 3 + (right.publishedContentCountCached ?? 0);
            return rightScore - leftScore;
          })
          .slice(0, 8)
          .map((creator) => ({
            id: creator.id,
            title: creator.displayName,
            note: `@${creator.handle} · ${(creator.followerCountCached ?? 0) + (creator.publishedContentCountCached ?? 0)} sinais em subida agora`,
            eyebrow: 'tracao',
            accentColor: '#67d6a3',
            onPress: () => openArtistFromCreator(creator),
          }));
      default:
        return [];
    }
  }, [activeIntentId, community.livePlansByCreatorId, creators, followedCreatorIds, liveCandidates, tracks]);

  const searchResults = useMemo<DiscoveryRow[]>(() => {
    if (!normalizedQuery) {
      return [];
    }

    const artistResults = creators
      .filter((creator) =>
        normalizeText(`${creator.displayName} ${creator.handle} ${creator.bio ?? ''}`).includes(normalizedQuery),
      )
      .slice(0, 5)
      .map((creator) => ({
        id: `artist-${creator.id}`,
        title: creator.displayName,
        note: `@${creator.handle}`,
        eyebrow: 'artista',
        accentColor: '#9fd6ff',
        onPress: () => openArtistFromCreator(creator),
      }));

    const trackResults = tracks
      .filter((track) => buildTrackSearchText(track).includes(normalizedQuery))
      .slice(0, 6)
      .map((track) => ({
        id: `track-${track.id}`,
        title: track.title,
        note: `${track.track?.artistNameDisplay ?? track.creator.displayName} · ${track.primaryCategory?.displayName ?? 'faixa'}`,
        eyebrow: 'faixa',
        accentColor: '#37b8ff',
        onPress: () => openArtistFromTrack(track),
      }));

    const liveResults = liveCandidates
      .filter((room) => normalizeText(`${room.creatorName} ${room.title} ${room.note}`).includes(normalizedQuery))
      .slice(0, 4)
      .map((room) => ({
        id: `live-${room.id}`,
        title: room.creatorName,
        note: `${room.kind} · ${room.note}`,
        eyebrow: 'aura',
        accentColor: '#8b5cf6',
        onPress: () => {
          const creator = creators.find((entry) => entry.id === room.creatorId);
          if (creator) {
            openArtistFromCreator(creator);
          }
        },
      }));

    const categoryResults = searchCategoryEntries
      .filter((entry) => normalizeText(`${entry.title} ${entry.note}`).includes(normalizedQuery))
      .slice(0, 4)
      .map((entry) => ({
        id: `category-${entry.id}`,
        title: entry.title,
        note: entry.note,
        eyebrow: 'categoria',
        accentColor: '#67d6a3',
        onPress: () => {
          setSection('categories');
          setQuery('');
        },
      }));

    const intentResults = searchIntentEntries
      .filter((entry) => normalizeText(`${entry.title} ${entry.note}`).includes(normalizedQuery))
      .slice(0, 4)
      .map((entry) => ({
        id: `intent-${entry.id}`,
        title: entry.title,
        note: `${entry.note} · atalho de descoberta`,
        eyebrow: 'intencao',
        accentColor: entry.color,
        onPress: () => {
          setActiveIntentId(entry.id);
          setSection('home');
          setQuery('');
        },
      }));

    return [...artistResults, ...trackResults, ...liveResults, ...categoryResults, ...intentResults].slice(0, 12);
  }, [creators, liveCandidates, normalizedQuery, tracks]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <ActivityIndicator />
        <Text style={{ color: palette.mutedOnDark }}>Abrindo busca...</Text>
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
            void echoApi.followCreator(artistDetail.creator.id);
          }}
          onSelectTrack={async (track) => {
            setArtistDetail((current) => (current ? { ...current, selectedTrackId: track.id } : current));
            await onSelectTrack(track);
          }}
        />
      ) : (
        <>
          <SectionIntro
            title="Buscar"
            caption="Entre por artista, categoria, ao vivo ou por um impulso de descoberta."
            tone="dark"
          />

          <GlassCard tone="dark">
            <TextInput
              placeholder="Buscar no Echo inteiro"
              placeholderTextColor={palette.mutedOnDark}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: palette.textOnDark,
              }}
            />
          </GlassCard>

          {error ? (
            <GlassCard tone="danger">
              <Text style={{ color: '#881337', fontWeight: '700' }}>Busca indisponivel</Text>
              <Text style={{ color: '#9f1239' }}>{error}</Text>
            </GlassCard>
          ) : null}

          {normalizedQuery ? (
            <View style={{ gap: 10 }}>
              {searchResults.map((result) => (
                <DiscoveryRowCard key={result.id} row={result} />
              ))}
              {searchResults.length === 0 ? (
                <GlassCard tone="dark">
                  <Text style={{ color: palette.mutedOnDark }}>Nada apareceu ainda para esse termo.</Text>
                </GlassCard>
              ) : null}
            </View>
          ) : null}

          {!normalizedQuery && section === 'home' ? (
            <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                <ExploreMiniTile
                  title="Artistas"
                  note="quem voce segue e quem esta nascendo"
                  onPress={() => {
                    setSection('artists');
                    setActiveIntentId(null);
                  }}
                  variant="large"
                />
                <ExploreMiniTile
                  title="Categorias"
                  note="entradas rapidas para abrir o catalogo certo"
                  onPress={() => {
                    setSection('categories');
                    setActiveIntentId(null);
                  }}
                  variant="large"
                />
                <ExploreMiniTile
                  title="Descoberta ao vivo"
                  note="Aura, drops e sinais em giro agora"
                  onPress={() => {
                    setSection('live');
                    setActiveIntentId(null);
                  }}
                  variant="large"
                />
              </View>

              <View style={{ gap: 12 }}>
                <SectionIntro
                  title="Entrar por intenção"
                  caption="Quando voce ainda nao sabe o nome, mas ja sabe o tipo de descoberta que quer."
                  tone="dark"
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {searchIntentEntries.map((intent) => (
                    <Pressable
                      key={intent.id}
                      onPress={() => setActiveIntentId(intent.id)}
                      style={{
                        width: '48%',
                        minHeight: 112,
                        padding: 14,
                        borderRadius: 20,
                        backgroundColor: activeIntentId === intent.id ? 'rgba(17,24,39,0.96)' : 'rgba(10,14,30,0.82)',
                        borderWidth: 1,
                        borderColor: activeIntentId === intent.id ? `${intent.color}66` : 'rgba(201,214,255,0.14)',
                        gap: 8,
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
                          backgroundColor: intent.color,
                        }}
                      />
                      <Text style={{ color: intent.color, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                        intencao
                      </Text>
                      <Text style={{ color: palette.textOnDark, fontSize: 17, fontWeight: '700' }}>{intent.title}</Text>
                      <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{intent.note}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {activeIntentId ? (
                <View style={{ gap: 10 }}>
                  {activeIntentRows.map((row) => (
                    <DiscoveryRowCard key={row.id} row={row} />
                  ))}
                  {activeIntentRows.length === 0 ? (
                    <GlassCard tone="dark">
                      <Text style={{ color: palette.mutedOnDark }}>
                        Essa entrada ainda esta vazia na base atual. Quando novos sinais entrarem, ela ganha corpo.
                      </Text>
                    </GlassCard>
                  ) : null}
                </View>
              ) : null}
            </>
          ) : null}

          {!normalizedQuery && section !== 'home' ? (
            <Pressable
              onPress={() => {
                setSection('home');
                setActiveIntentId(null);
              }}
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(201,214,255,0.14)',
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
                  backgroundColor: '#97dbb3',
                }}
              />
              <Text style={{ color: palette.textOnDark, fontWeight: '700' }}>Voltar</Text>
            </Pressable>
          ) : null}

          {!normalizedQuery && section === 'artists' ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {visibleArtistList.slice(0, 12).map((creator) => (
                <ExploreMiniTile
                  key={creator.id}
                  title={creator.displayName}
                  note={`@${creator.handle}`}
                  onPress={() => openArtistFromCreator(creator)}
                />
              ))}
            </View>
          ) : null}

          {!normalizedQuery && section === 'categories' ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {searchCategoryEntries.map((entry) => (
                <ExploreMiniTile key={entry.id} title={entry.title} note={entry.note} />
              ))}
            </View>
          ) : null}

          {!normalizedQuery && section === 'live' ? (
            <View style={{ gap: 10 }}>
              {liveCreatorList.map((entry) => {
                const creator = creators.find((item) => item.id === entry.creatorId);
                if (!creator) {
                  return null;
                }

                return (
                  <DiscoveryRowCard
                    key={entry.id}
                    row={{
                      id: entry.id,
                      title: creator.displayName,
                      note: `${entry.note} · ${entry.source === 'following' ? 'no seu circulo' : 'global'}`,
                      eyebrow: 'aura',
                      accentColor: '#8b5cf6',
                      onPress: () => openArtistFromCreator(creator),
                    }}
                  />
                );
              })}
              {liveCreatorList.length === 0 ? (
                <GlassCard tone="dark">
                  <Text style={{ color: palette.mutedOnDark }}>
                    Sem presenca ao vivo forte agora. Quando o Aura ganhar movimento, essa entrada sobe primeiro.
                  </Text>
                </GlassCard>
              ) : null}
            </View>
          ) : null}
        </>
      )}
    </ScreenScroll>
  );
}

function DiscoveryRowCard({ row }: { row: DiscoveryRow }) {
  return (
    <Pressable
      onPress={row.onPress}
      style={{
        padding: 14,
        borderRadius: 20,
        backgroundColor: 'rgba(10,14,30,0.82)',
        borderWidth: 1,
        borderColor: 'rgba(201,214,255,0.14)',
        gap: 4,
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
          backgroundColor: row.accentColor,
        }}
      />
      <Text style={{ color: row.accentColor, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
        {row.eyebrow}
      </Text>
      <Text style={{ color: palette.textOnDark, fontWeight: '700' }}>{row.title}</Text>
      <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{row.note}</Text>
    </Pressable>
  );
}

