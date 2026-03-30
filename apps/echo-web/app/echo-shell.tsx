'use client';

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { DemoSetupCard } from './components/demo-setup-card';
import { CreatorWorkspace } from './components/echo/creator-workspace';
import { ListenerLibrary } from './components/echo/listener-library';
import {
  ActionButton,
  Card,
  Chip,
  Grid,
  LinkButton,
  MetricCard,
  Notice,
  PageShell,
  Pill,
  Stack,
  TabButton,
  helperTextStyle,
} from './components/ui';
import {
  EchoCategory,
  EchoCreator,
  EchoTrack,
  FollowedCreatorEntry,
  ReportReason,
  SavedTrackEntry,
  echoApi,
} from './lib/api';
import { ACCESS_ROOMS, AccessRoomId, getAccessRoomMeta } from './lib/access-rooms';
import {
  LibraryMemorySnapshot,
  createEmptyLibraryMemory,
  cyclePublicFolder,
  loadLibraryMemory,
  persistLibraryMemory,
} from './lib/library-memory';
import {
  createEmptyListenerMemory,
  loadListenerMemory,
  persistListenerMemory,
} from './lib/listener-memory';
import {
  buildListenerFeedTracks,
  buildReserveTracks,
  buildRoomedTracks,
  buildSeparatedRoomTracks,
} from './lib/feed-engine';

type TabId = 'feed' | 'explore' | 'upload' | 'creators';
type ViewerMode = 'listener' | 'creator';

const tabs: Array<{ id: TabId; label: string; audience: ViewerMode }> = [
  { id: 'feed', label: 'Feed', audience: 'listener' },
  { id: 'explore', label: 'Explore', audience: 'listener' },
  { id: 'creators', label: 'Artists', audience: 'listener' },
  { id: 'upload', label: 'Creator area', audience: 'creator' },
];

const TAB_COPY: Record<TabId, { eyebrow: string; title: string; subtitle: string }> = {
  feed: {
    eyebrow: 'Listener loop',
    title: 'Feed + player',
    subtitle: 'Descoberta, escuta, save e report num fluxo unico.',
  },
  explore: {
    eyebrow: 'Catalog',
    title: 'Explore o acervo',
    subtitle: 'Faixas salvas e categorias que ajudam a ler a qualidade do catalogo.',
  },
  creators: {
    eyebrow: 'Artist radar',
    title: 'Artists',
    subtitle: 'Quem o publico pode seguir e quem ja esta ganhando forma dentro do Echo.',
  },
  upload: {
    eyebrow: 'Creator access',
    title: 'Area do creator',
    subtitle: 'Entrada profissional para criar perfil, publicar e organizar o proprio ponto de partida.',
  },
};

const REPORT_REASON_OPTIONS: Array<{ label: string; reason: ReportReason }> = [
  { label: 'Nao e IA', reason: 'not_ai_content' },
  { label: 'Spam', reason: 'duplicate_or_spam' },
  { label: 'Direitos', reason: 'rights_or_ownership_issue' },
];

function getCreatorTierTone(tier: string): 'default' | 'accent' | 'success' | 'warning' {
  if (tier.toLowerCase().includes('elite') || tier.toLowerCase().includes('prime')) {
    return 'success';
  }

  if (tier.toLowerCase().includes('rising') || tier.toLowerCase().includes('viral')) {
    return 'accent';
  }

  return 'warning';
}

function buildArtworkStyle(seed: string): CSSProperties {
  const palette = [
    ['#0f172a', '#2563eb'],
    ['#111827', '#0891b2'],
    ['#172554', '#7c3aed'],
    ['#1f2937', '#ea580c'],
    ['#0b1120', '#14b8a6'],
  ];
  const index = seed
    .split('')
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0) % palette.length;
  const [from, to] = palette[index];

  return {
    width: 140,
    minWidth: 140,
    aspectRatio: '1 / 1',
    borderRadius: 26,
    background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 30%), linear-gradient(145deg, ${from}, ${to})`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
    position: 'relative',
    overflow: 'hidden',
  };
}

export function EchoShell() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>('listener');
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [showSetupDetails, setShowSetupDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [categories, setCategories] = useState<EchoCategory[]>([]);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [savedTracks, setSavedTracks] = useState<SavedTrackEntry[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [reportComposerTrackId, setReportComposerTrackId] = useState<string | null>(null);
  const [feedbackByTrack, setFeedbackByTrack] = useState<Record<string, string>>({});
  const [feedbackByCreator, setFeedbackByCreator] = useState<Record<string, string>>({});
  const [hiddenTrackIds, setHiddenTrackIds] = useState<string[]>([]);
  const [mutedCreatorIds, setMutedCreatorIds] = useState<string[]>([]);
  const [hiddenTrackCatalog, setHiddenTrackCatalog] = useState<Record<string, string>>({});
  const [mutedCreatorCatalog, setMutedCreatorCatalog] = useState<Record<string, string>>({});
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<string[]>([]);
  const [deprioritizedCategoryIds, setDeprioritizedCategoryIds] = useState<string[]>([]);
  const [hiddenCategoryCatalog, setHiddenCategoryCatalog] = useState<Record<string, string>>({});
  const [deprioritizedCategoryCatalog, setDeprioritizedCategoryCatalog] = useState<
    Record<string, string>
  >({});
  const [trackSignals, setTrackSignals] = useState<Record<string, number>>({});
  const [creatorSignals, setCreatorSignals] = useState<Record<string, number>>({});
  const [categorySignals, setCategorySignals] = useState<Record<string, number>>({});
  const [shortSessionTrackCounts, setShortSessionTrackCounts] = useState<Record<string, number>>({});
  const [shortSessionCreatorCounts, setShortSessionCreatorCounts] = useState<Record<string, number>>(
    {},
  );
  const [shortSessionCategoryCounts, setShortSessionCategoryCounts] = useState<
    Record<string, number>
  >({});
  const [libraryMemory, setLibraryMemory] = useState<LibraryMemorySnapshot>(() =>
    createEmptyLibraryMemory(),
  );

  const [creatorId, setCreatorId] = useState(echoApi.demoCreatorId ?? '');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupHandle, setSetupHandle] = useState('');
  const [setupBio, setSetupBio] = useState('');
  const [setupResultMessage, setSetupResultMessage] = useState<string | null>(null);
  const [creatingCreator, setCreatingCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [artistNameDisplay, setArtistNameDisplay] = useState('');
  const [description, setDescription] = useState('');
  const [sourceToolOptional, setSourceToolOptional] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [aiDeclaration, setAiDeclaration] = useState(true);
  const [accessRoom, setAccessRoom] = useState<AccessRoomId>('standard');
  const [enabledAccessRooms, setEnabledAccessRooms] = useState<AccessRoomId[]>(['standard']);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const memory = loadListenerMemory();
    const nextLibraryMemory = loadLibraryMemory();

    setHiddenTrackIds(memory.hiddenTrackIds);
    setMutedCreatorIds(memory.mutedCreatorIds);
    setHiddenTrackCatalog(memory.hiddenTrackCatalog);
    setMutedCreatorCatalog(memory.mutedCreatorCatalog);
    setHiddenCategoryIds(memory.hiddenCategoryIds);
    setDeprioritizedCategoryIds(memory.deprioritizedCategoryIds);
    setHiddenCategoryCatalog(memory.hiddenCategoryCatalog);
    setDeprioritizedCategoryCatalog(memory.deprioritizedCategoryCatalog);
    setTrackSignals(memory.trackSignals);
    setCreatorSignals(memory.creatorSignals);
    setCategorySignals(memory.categorySignals);
    setShortSessionTrackCounts(memory.shortSessionTrackCounts);
    setShortSessionCreatorCounts(memory.shortSessionCreatorCounts);
    setShortSessionCategoryCounts(memory.shortSessionCategoryCounts);
    setLibraryMemory(nextLibraryMemory);
  }, []);

  useEffect(() => {
    persistListenerMemory({
        hiddenTrackIds,
        mutedCreatorIds,
        hiddenTrackCatalog,
        mutedCreatorCatalog,
        hiddenCategoryIds,
        deprioritizedCategoryIds,
        hiddenCategoryCatalog,
        deprioritizedCategoryCatalog,
        trackSignals,
        creatorSignals,
        categorySignals,
        shortSessionTrackCounts,
        shortSessionCreatorCounts,
        shortSessionCategoryCounts,
      });
  }, [
    categorySignals,
    creatorSignals,
    deprioritizedCategoryCatalog,
    deprioritizedCategoryIds,
    hiddenCategoryCatalog,
    hiddenCategoryIds,
    hiddenTrackCatalog,
    hiddenTrackIds,
    mutedCreatorCatalog,
    mutedCreatorIds,
    shortSessionCategoryCounts,
    shortSessionCreatorCounts,
    shortSessionTrackCounts,
    trackSignals,
  ]);

  useEffect(() => {
    persistLibraryMemory(libraryMemory);
  }, [libraryMemory]);

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        const [trackData, categoryData, creatorData, savedData, followedData] = await Promise.all([
          echoApi.getTracks({ limit: 60 }),
          echoApi.getCategories(),
          echoApi.getCreators(),
          echoApi.getSavedTracks().catch(() => []),
          echoApi.getFollowedCreators().catch(() => []),
        ]);

        if (!active) {
          return;
        }

        setTracks(trackData);
        setCategories(categoryData);
        setCreators(creatorData);
        setSavedTracks(savedData);
        setFollowedCreators(followedData);
        setSelectedTrackId((current) => current ?? trackData[0]?.id ?? null);

        const resolvedCreator =
          creatorData.find((creator) => creator.id === echoApi.demoCreatorId) ?? creatorData[0];

        if (resolvedCreator) {
          setCreatorId((current) => current || resolvedCreator.id);
          setArtistNameDisplay((current) =>
            current || resolvedCreator.displayName || resolvedCreator.handle,
          );
          setSetupDisplayName((current) => current || resolvedCreator.displayName);
          setSetupHandle((current) => current || resolvedCreator.handle);
          setSetupBio((current) => current || resolvedCreator.bio || '');
        }

        if (categoryData[0]) {
          setPrimaryCategoryId((current) => current || categoryData[0].id);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load Echo data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      active = false;
    };
  }, []);

  const selectedTrack = useMemo(
    () =>
      tracks.find(
        (track) =>
          track.id === selectedTrackId &&
          !hiddenTrackIds.includes(track.id) &&
          !mutedCreatorIds.includes(track.creator.id),
      ) ?? null,
    [hiddenTrackIds, mutedCreatorIds, selectedTrackId, tracks],
  );
  const visibleTabs = tabs.filter((tab) => tab.audience === viewerMode);
  const tabCopy = TAB_COPY[activeTab];
  const listenerVisibleCreators = useMemo(
    () => creators.filter((creator) => !mutedCreatorIds.includes(creator.id)),
    [creators, mutedCreatorIds],
  );
  const followedCreatorIds = useMemo(
    () => new Set(followedCreators.map((entry) => entry.creator.id)),
    [followedCreators],
  );
  const savedTrackIds = useMemo(
    () => new Set(savedTracks.map((entry) => entry.content.id)),
    [savedTracks],
  );
  const listenerFeedTracks = useMemo(
    () =>
      buildListenerFeedTracks({
        tracks,
        hiddenTrackIds,
        mutedCreatorIds,
        hiddenCategoryIds,
        deprioritizedCategoryIds,
        trackSignals,
        creatorSignals,
        categorySignals,
        shortSessionTrackCounts,
        shortSessionCreatorCounts,
        shortSessionCategoryCounts,
        savedTracks,
        savedTrackIds,
        followedCreatorIds,
        enabledAccessRooms,
      }),
    [
      categorySignals,
      creatorSignals,
      deprioritizedCategoryIds,
      enabledAccessRooms,
      followedCreatorIds,
      hiddenCategoryIds,
      hiddenTrackIds,
      mutedCreatorIds,
      savedTrackIds,
      savedTracks,
      shortSessionCategoryCounts,
      shortSessionCreatorCounts,
      shortSessionTrackCounts,
      trackSignals,
      tracks,
    ],
  );
  const roomedTracks = useMemo(
    () =>
      buildRoomedTracks({
        tracks,
        hiddenTrackIds,
        mutedCreatorIds,
        hiddenCategoryIds,
        deprioritizedCategoryIds,
        trackSignals,
        creatorSignals,
        categorySignals,
        shortSessionTrackCounts,
        shortSessionCreatorCounts,
        shortSessionCategoryCounts,
        savedTracks,
        savedTrackIds,
        followedCreatorIds,
        enabledAccessRooms,
      }),
    [hiddenCategoryIds, hiddenTrackIds, mutedCreatorIds, tracks],
  );
  const reserveTracks = useMemo(
    () => buildReserveTracks(roomedTracks),
    [roomedTracks],
  );
  const separatedRoomTracks = useMemo(
    () => buildSeparatedRoomTracks(roomedTracks, enabledAccessRooms),
    [enabledAccessRooms, roomedTracks],
  );
  const artistsToWatch = useMemo(
    () =>
      listenerVisibleCreators
        .slice()
        .sort((left, right) => right.followerCountCached - left.followerCountCached)
        .slice(0, 3),
    [listenerVisibleCreators],
  );
  function bumpTrackSignal(trackId: string, delta: number) {
    setTrackSignals((current) => ({
      ...current,
      [trackId]: Math.max(-8, Math.min(12, (current[trackId] ?? 0) + delta)),
    }));
  }

  function bumpCreatorSignal(creatorId: string, delta: number) {
    setCreatorSignals((current) => ({
      ...current,
      [creatorId]: Math.max(-10, Math.min(14, (current[creatorId] ?? 0) + delta)),
    }));
  }

  function bumpCategorySignal(categoryId: string, delta: number) {
    setCategorySignals((current) => ({
      ...current,
      [categoryId]: Math.max(-10, Math.min(14, (current[categoryId] ?? 0) + delta)),
    }));
  }

  function applyTrackPreference(
    track: EchoTrack,
    signal: { track?: number; creator?: number; category?: number },
  ) {
    if (signal.track) {
      bumpTrackSignal(track.id, signal.track);
    }

    if (signal.creator) {
      bumpCreatorSignal(track.creator.id, signal.creator);
    }

    if (signal.category && track.primaryCategory?.id) {
      bumpCategorySignal(track.primaryCategory.id, signal.category);
    }
  }

  function softenShortSessionMemory(track: EchoTrack) {
    setShortSessionTrackCounts((current) => {
      const nextValue = Math.max((current[track.id] ?? 0) - 1, 0);
      if (nextValue === 0) {
        const next = { ...current };
        delete next[track.id];
        return next;
      }

      return {
        ...current,
        [track.id]: nextValue,
      };
    });

    setShortSessionCreatorCounts((current) => {
      const nextValue = Math.max((current[track.creator.id] ?? 0) - 1, 0);
      if (nextValue === 0) {
        const next = { ...current };
        delete next[track.creator.id];
        return next;
      }

      return {
        ...current,
        [track.creator.id]: nextValue,
      };
    });

    if (track.primaryCategory?.id) {
      setShortSessionCategoryCounts((current) => {
        const nextValue = Math.max((current[track.primaryCategory?.id ?? ''] ?? 0) - 1, 0);
        if (!track.primaryCategory?.id) {
          return current;
        }

        if (nextValue === 0) {
          const next = { ...current };
          delete next[track.primaryCategory.id];
          return next;
        }

        return {
          ...current,
          [track.primaryCategory.id]: nextValue,
        };
      });
    }
  }

  function registerShortSession(track: EchoTrack) {
    let nextTrackCount = 0;
    let nextCreatorCount = 0;
    let nextCategoryCount = 0;
    const categoryId = track.primaryCategory?.id;
    const categoryLabel = track.primaryCategory?.displayName;

    setShortSessionTrackCounts((current) => {
      nextTrackCount = (current[track.id] ?? 0) + 1;
      return {
        ...current,
        [track.id]: nextTrackCount,
      };
    });

    setShortSessionCreatorCounts((current) => {
      nextCreatorCount = (current[track.creator.id] ?? 0) + 1;
      return {
        ...current,
        [track.creator.id]: nextCreatorCount,
      };
    });

    if (categoryId) {
      setShortSessionCategoryCounts((current) => {
        nextCategoryCount = (current[categoryId] ?? 0) + 1;
        return {
          ...current,
          [categoryId]: nextCategoryCount,
        };
      });
    }

    applyTrackPreference(track, { track: -2, category: -1 });

    if (nextTrackCount >= 2) {
      applyTrackPreference(track, { track: -3 });
    }

    if (nextCreatorCount >= 3) {
      bumpCreatorSignal(track.creator.id, -3);
    }

    if (categoryId && categoryLabel && nextCategoryCount >= 3) {
      setDeprioritizedCategoryIds((current) =>
        current.includes(categoryId) ? current : [...current, categoryId],
      );
      setDeprioritizedCategoryCatalog((current) => ({
        ...current,
        [categoryId]: categoryLabel,
      }));
    }

    const messages = ['Sessao curta registrada'];

    if (nextTrackCount >= 2) {
      messages.push('essa faixa vai perder prioridade rapido');
    }

    if (nextCreatorCount >= 3) {
      messages.push('o artista tambem vai esfriar');
    }

    if (categoryLabel && nextCategoryCount >= 3) {
      messages.push(`menos da linha ${categoryLabel}`);
    }

    return messages.join(' / ');
  }

  const risingCreators = useMemo(
    () =>
      creators
        .filter((creator) => !mutedCreatorIds.includes(creator.id))
        .slice()
        .sort(
          (left, right) =>
            right.followerCountCached +
            right.publishedContentCountCached * 3 -
            (left.followerCountCached + left.publishedContentCountCached * 3),
        )
        .slice(0, 4),
    [creators, mutedCreatorIds],
  );
  const firstBetCreators = useMemo(
    () =>
      listenerVisibleCreators
        .filter((creator) => !followedCreatorIds.has(creator.id))
        .slice()
        .sort((left, right) => right.publishedContentCountCached - left.publishedContentCountCached)
        .slice(0, 3),
    [followedCreatorIds, listenerVisibleCreators],
  );

  const summaryStats = [
    { label: 'Faixas ativas', value: tracks.length, note: 'Catalogo visivel no feed.' },
    { label: 'Saves demo', value: savedTracks.length, note: 'Sinal de repeticao e valor percebido.' },
    {
      label: 'Memoria fria',
      value: Object.keys(shortSessionTrackCounts).length,
      note: 'Faixas que ja sofreram sessao curta repetida e perderam prioridade.',
    },
    {
      label: 'Seguidos',
      value: followedCreators.length,
      note: 'Relacao ativa entre audiencia e creator.',
    },
  ];
  const listenerHighlights = [
    {
      label: 'Primeiro impacto',
      value: tracks[0]?.title ?? 'Sem faixa de abertura',
      note: 'A primeira musica precisa dizer rapido por que Echo existe.',
    },
    {
      label: 'Faixas para salvar',
      value: Math.min(Math.max(savedTracks.length + 3, 4), tracks.length || 4),
      note: 'Estimativa inicial de faixas que ja parecem fortes o suficiente para retention.',
    },
    {
      label: 'Artistas em radar',
      value: followedCreators.length || Math.min(creators.length, 6),
      note: 'Sinal de quantos nomes ja podem virar habito ou curiosidade.',
    },
    {
      label: 'Linhas reduzidas',
      value: deprioritizedCategoryIds.length,
      note: 'Echo ja carrega rejeicao entre sessoes em vez de recomeçar do zero.',
    },
  ];

  useEffect(() => {
    if (!listenerFeedTracks.length) {
      setSelectedTrackId(null);
      return;
    }

    if (!selectedTrackId || !listenerFeedTracks.some((track) => track.id === selectedTrackId)) {
      setSelectedTrackId(listenerFeedTracks[0]?.id ?? null);
    }
  }, [listenerFeedTracks, selectedTrackId]);

  async function refreshSavedAndFollowed() {
    const [savedData, followedData] = await Promise.all([
      echoApi.getSavedTracks().catch(() => []),
      echoApi.getFollowedCreators().catch(() => []),
    ]);

    setSavedTracks(savedData);
    setFollowedCreators(followedData);
  }

  async function handleSave(contentId: string) {
    try {
      const result = await echoApi.saveTrack(contentId);
      const track = tracks.find((entry) => entry.id === contentId);
      if (track && !result.alreadySaved) {
        applyTrackPreference(track, { track: 2, creator: 1, category: 2 });
      }
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]: result.alreadySaved ? 'Faixa ja salva' : 'Faixa salva no preview web',
      }));
      await refreshSavedAndFollowed();
    } catch (saveError) {
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]:
          saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar a faixa',
      }));
    }
  }

  async function handlePlaybackPreset(
    contentId: string,
    listenedMs: number,
    completionRatio: number,
    successMessage: string,
  ) {
    try {
      await echoApi.recordPlayback(contentId, {
        userId: echoApi.demoUserId,
        listenedMs,
        completionRatio,
        replayCountInSession: 0,
        sourceContext: 'echo-web-player',
      });
      const track = tracks.find((entry) => entry.id === contentId);
      if (track) {
        if (completionRatio >= 0.9) {
          applyTrackPreference(track, { track: 3, creator: 1, category: 2 });
          softenShortSessionMemory(track);
        } else if (completionRatio >= 0.6) {
          applyTrackPreference(track, { track: 1, category: 1 });
          softenShortSessionMemory(track);
        } else if (completionRatio <= 0.35) {
          successMessage = registerShortSession(track);
        }
      }

      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]: successMessage,
      }));
    } catch (playbackError) {
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]:
          playbackError instanceof Error
            ? playbackError.message
            : 'Nao foi possivel registrar playback',
      }));
    }
  }
  async function handleReport(contentId: string, reason: ReportReason) {
    try {
      const report = await echoApi.reportTrack(contentId, reason);
      const track = tracks.find((entry) => entry.id === contentId);
      if (track) {
        applyTrackPreference(track, { track: -4, creator: -2, category: -1 });
      }
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]: `Report enviado: ${report.reportReason}`,
      }));
      setReportComposerTrackId(null);
    } catch (reportError) {
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]:
          reportError instanceof Error ? reportError.message : 'Nao foi possivel reportar a faixa',
      }));
    }
  }

  async function handleFollow(creatorIdToFollow: string) {
    try {
      const result = await echoApi.followCreator(creatorIdToFollow);
      if (!result.alreadyFollowing) {
        bumpCreatorSignal(creatorIdToFollow, 3);
      }
      setFeedbackByCreator((current) => ({
        ...current,
        [creatorIdToFollow]: result.alreadyFollowing
          ? 'Creator ja seguido no preview web'
          : 'Follow registrado no preview web',
      }));
      await refreshSavedAndFollowed();
    } catch (followError) {
      setFeedbackByCreator((current) => ({
        ...current,
        [creatorIdToFollow]:
          followError instanceof Error
            ? followError.message
            : 'Nao foi possivel seguir o creator',
      }));
    }
  }

  function handleHideTrack(track: EchoTrack) {
    applyTrackPreference(track, { track: -5, creator: -1, category: -1 });
    setHiddenTrackIds((current) => (current.includes(track.id) ? current : [...current, track.id]));
    setHiddenTrackCatalog((current) => ({
      ...current,
      [track.id]: `${track.title} / ${track.track?.artistNameDisplay ?? track.creator.displayName}`,
    }));
    setFeedbackByTrack((current) => ({
      ...current,
      [track.id]: 'Faixa escondida do seu Echo',
    }));
  }

  function handleDeprioritizeCategory(track: EchoTrack) {
    const categoryId = track.primaryCategory?.id;
    const categoryLabel = track.primaryCategory?.displayName;

    if (!categoryId || !categoryLabel) {
      setFeedbackByTrack((current) => ({
        ...current,
        [track.id]: 'Essa faixa ainda nao tem categoria forte para reduzir.',
      }));
      return;
    }

    applyTrackPreference(track, { category: -3 });
    setDeprioritizedCategoryIds((current) =>
      current.includes(categoryId) ? current : [...current, categoryId],
    );
    setDeprioritizedCategoryCatalog((current) => ({
      ...current,
      [categoryId]: categoryLabel,
    }));
    setFeedbackByTrack((current) => ({
      ...current,
      [track.id]: `Echo vai reduzir a linha ${categoryLabel}`,
    }));
  }

  function handleHideCategory(track: EchoTrack) {
    const categoryId = track.primaryCategory?.id;
    const categoryLabel = track.primaryCategory?.displayName;

    if (!categoryId || !categoryLabel) {
      setFeedbackByTrack((current) => ({
        ...current,
        [track.id]: 'Essa faixa ainda nao tem estilo suficiente para ocultar.',
      }));
      return;
    }

    applyTrackPreference(track, { category: -5, track: -1 });
    setHiddenCategoryIds((current) =>
      current.includes(categoryId) ? current : [...current, categoryId],
    );
    setHiddenCategoryCatalog((current) => ({
      ...current,
      [categoryId]: categoryLabel,
    }));
    setFeedbackByTrack((current) => ({
      ...current,
      [track.id]: `Estilo ${categoryLabel} ocultado do seu Echo`,
    }));
  }

  function handleMuteCreator(creator: EchoCreator | EchoTrack['creator']) {
    bumpCreatorSignal(creator.id, -6);
    setMutedCreatorIds((current) =>
      current.includes(creator.id) ? current : [...current, creator.id],
    );
    setMutedCreatorCatalog((current) => ({
      ...current,
      [creator.id]: creator.displayName,
    }));
    setFeedbackByCreator((current) => ({
      ...current,
      [creator.id]: 'Artista silenciado do seu fluxo',
    }));
  }

  function restoreHiddenTrack(trackId: string) {
    setHiddenTrackIds((current) => current.filter((id) => id !== trackId));
    setHiddenTrackCatalog((current) => {
      const next = { ...current };
      delete next[trackId];
      return next;
    });
  }

  function restoreMutedCreator(creatorIdToRestore: string) {
    setMutedCreatorIds((current) => current.filter((id) => id !== creatorIdToRestore));
    setMutedCreatorCatalog((current) => {
      const next = { ...current };
      delete next[creatorIdToRestore];
      return next;
    });
  }

  function restoreHiddenCategory(categoryId: string) {
    setHiddenCategoryIds((current) => current.filter((id) => id !== categoryId));
    setHiddenCategoryCatalog((current) => {
      const next = { ...current };
      delete next[categoryId];
      return next;
    });
  }

  function restoreDeprioritizedCategory(categoryId: string) {
    setDeprioritizedCategoryIds((current) => current.filter((id) => id !== categoryId));
    setDeprioritizedCategoryCatalog((current) => {
      const next = { ...current };
      delete next[categoryId];
      return next;
    });
  }

  function clearAllExclusions() {
    setHiddenTrackIds([]);
    setMutedCreatorIds([]);
    setHiddenTrackCatalog({});
    setMutedCreatorCatalog({});
    setHiddenCategoryIds([]);
    setDeprioritizedCategoryIds([]);
    setHiddenCategoryCatalog({});
    setDeprioritizedCategoryCatalog({});
  }

  function cycleTrackPublicFolder(trackId: string) {
    setLibraryMemory((current) => ({
      ...current,
      publicTrackFolderById: cyclePublicFolder(trackId, current),
    }));
  }

  function toggleTrackOffline(trackId: string) {
    setLibraryMemory((current) => ({
      ...current,
      offlineTrackIds: current.offlineTrackIds.includes(trackId)
        ? current.offlineTrackIds.filter((id) => id !== trackId)
        : [...current.offlineTrackIds, trackId],
    }));
  }

  function toggleTrackShared(trackId: string) {
    setLibraryMemory((current) => ({
      ...current,
      sharedTrackIds: current.sharedTrackIds.includes(trackId)
        ? current.sharedTrackIds.filter((id) => id !== trackId)
        : [...current.sharedTrackIds, trackId],
    }));
  }

  function toggleBorrowedCreator(creatorIdToToggle: string) {
    setLibraryMemory((current) => ({
      ...current,
      borrowedCreatorIds: current.borrowedCreatorIds.includes(creatorIdToToggle)
        ? current.borrowedCreatorIds.filter((id) => id !== creatorIdToToggle)
        : [...current.borrowedCreatorIds, creatorIdToToggle],
    }));
  }

  async function handleCreatorSetup() {
    if (!setupEmail.trim() || !setupDisplayName.trim() || !setupHandle.trim()) {
      setSetupResultMessage('Email, display name and handle are required to create a creator.');
      return;
    }

    setCreatingCreator(true);
    setSetupResultMessage('Creating account and creator profile...');

    try {
      const user = await echoApi.registerUser({
        email: setupEmail.trim(),
        country: 'BR',
        preferredLanguage: 'pt-BR',
      });

      const creator = await echoApi.createCreatorProfile({
        userId: user.id,
        displayName: setupDisplayName.trim(),
        handle: setupHandle.trim().replace(/^@+/, ''),
        bio: setupBio.trim() || undefined,
        primaryFront: 'echo',
      });

      const updatedCreators = await echoApi.getCreators();

      setCreators(updatedCreators);
      setCreatorId(creator.id);
      setArtistNameDisplay((current) => current || creator.displayName);
      setSetupResultMessage(`Creator ready: ${creator.displayName} (@${creator.handle})`);
      setSetupEmail('');
      setSetupBio('');
    } catch (setupError) {
      setSetupResultMessage(
        setupError instanceof Error ? setupError.message : 'Unable to create creator profile',
      );
    } finally {
      setCreatingCreator(false);
    }
  }

  async function handleSubmitTrack() {
    if (!creatorId || !title.trim() || !artistNameDisplay.trim()) {
      setUploadMessage('Creator, title and artist name are required.');
      return;
    }

    setSubmitting(true);
    setUploadMessage('Submitting...');

    try {
      const track = await echoApi.createTrack({
        creatorId,
        title: title.trim(),
        description: description.trim() || undefined,
        primaryCategoryId: primaryCategoryId || undefined,
        artistNameDisplay: artistNameDisplay.trim(),
        accessRoom,
        aiDeclaration,
        sourceToolOptional: sourceToolOptional.trim() || undefined,
      });

      setTracks((current) => [track, ...current]);
      setSelectedTrackId(track.id);
      setTitle('');
      setDescription('');
      setSourceToolOptional('');
      setAccessRoom('standard');
      setUploadMessage(`Track created: ${track.title}`);
    } catch (submitError) {
      setUploadMessage(
        submitError instanceof Error ? `Upload failed: ${submitError.message}` : 'Upload failed',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function toggleAccessRoom(roomId: AccessRoomId) {
    if (roomId === 'standard') {
      return;
    }

    setEnabledAccessRooms((current) =>
      current.includes(roomId)
        ? current.filter((room) => room !== roomId)
        : [...current, roomId],
    );
  }

  return (
    <PageShell
      title="Echo"
      description="Primeira frente publica do Northstar Ecosystem. O Echo e o app publico de musica IA: ouvintes entram para descobrir e salvar; creators entram para publicar e construir presenca; gestao fica fora daqui."
    >
      <Stack gap={20}>
        <Grid min={260}>
          <Card
            title="A musica IA em primeiro plano"
            subtitle="Echo comeca como um palco de descoberta, nao como uma ferramenta de criacao."
            accent="#1d4ed8"
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Pill label="Echo / Music IA" tone="accent" />
                <Pill label="Preview de navegador" tone="success" />
                <Pill label="API local conectada" tone={error ? 'warning' : 'success'} />
              </div>
              <p style={helperTextStyle}>
                Aqui a gente valida o produto publico antes do acabamento final: uma experiencia
                para ouvir, uma entrada separada para creators e a gestao fora do app.
              </p>
            </Stack>
          </Card>

          <Card title={tabCopy.title} subtitle={tabCopy.eyebrow} accent="rgba(59, 130, 246, 0.5)">
            <p style={helperTextStyle}>{tabCopy.subtitle}</p>
          </Card>
        </Grid>

        <Grid min={180}>
          {summaryStats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
          ))}
        </Grid>

        {viewerMode === 'listener' ? (
          <Grid min={220}>
            {listenerHighlights.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
            ))}
          </Grid>
        ) : null}

        <Grid min={260}>
          <Card
            title="Quem esta entrando agora?"
            subtitle="O Echo e um app publico, mas com dois caminhos bem diferentes."
            accent="rgba(59, 130, 246, 0.35)"
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <ActionButton
                  label="Entrar como ouvinte"
                  tone={viewerMode === 'listener' ? 'default' : 'secondary'}
                  onClick={() => {
                    setViewerMode('listener');
                    setActiveTab('feed');
                  }}
                />
                <ActionButton
                  label="Entrar como creator"
                  tone={viewerMode === 'creator' ? 'default' : 'secondary'}
                  onClick={() => {
                    setViewerMode('creator');
                    setActiveTab('upload');
                  }}
                />
              </div>
              <p style={helperTextStyle}>
                Ouvintes entram para descobrir musica e seguir artistas. Creators entram para criar
                perfil e subir faixas. A gestao usa Admin e Command Center fora do Echo.
              </p>
            </Stack>
          </Card>

          <Card
            title={viewerMode === 'listener' ? 'Modo ouvinte' : 'Modo creator'}
            subtitle={viewerMode === 'listener' ? 'Experiencia publica principal' : 'Entrada profissional no app'}
            accent={viewerMode === 'listener' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(249, 115, 22, 0.35)'}
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label={viewerMode === 'listener' ? 'Publico geral' : 'Creator access'} tone="accent" />
                <Pill label="Gestao fora do app" tone="default" />
              </div>
              <p style={helperTextStyle}>
                {viewerMode === 'listener'
                  ? 'Aqui a prioridade e ouvir rapido, explorar, salvar e acompanhar artistas.'
                  : 'Aqui a prioridade e ativar identidade, publicar e acompanhar o proprio ponto de partida.'}
              </p>
            </Stack>
          </Card>

          <Card
            title="Gestao"
            subtitle="Nao faz parte da experiencia publica do Echo."
            accent="rgba(148, 163, 184, 0.28)"
          >
            <p style={helperTextStyle}>
              Reports, moderacao, riscos, operacao e leitura de saude do sistema vivem no Admin
              Web e no Command Center. O app publico nao deve carregar funcao de gestor.
            </p>
          </Card>
        </Grid>

        <Card
          title="Horizonte"
          subtitle="Echo ja esta vivo. Pulse e Lumen aparecem como proxmos passos do mesmo ecossistema."
          accent="rgba(99, 102, 241, 0.24)"
        >
          <Grid min={220}>
            <div
              style={{
                border: '1px solid rgba(59, 130, 246, 0.32)',
                borderRadius: 20,
                padding: 18,
                background: 'rgba(7, 17, 31, 0.82)',
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <Pill label="Echo" tone="success" />
                <Pill label="ativo" tone="accent" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Music IA</div>
              <p style={{ ...helperTextStyle, marginTop: 8 }}>
                Descoberta, biblioteca e creator workspace comecam aqui.
              </p>
            </div>

            <div
              style={{
                border: '1px solid rgba(148, 163, 184, 0.24)',
                borderRadius: 20,
                padding: 18,
                background: 'rgba(7, 17, 31, 0.7)',
                opacity: 0.84,
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <Pill label="Pulse" tone="default" />
                <Pill label="proximo" tone="warning" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Shorts IA</div>
              <p style={{ ...helperTextStyle, marginTop: 8 }}>
                O mesmo creator workspace vai depois abrir a camada de alcance e viralizacao.
              </p>
            </div>

            <div
              style={{
                border: '1px solid rgba(148, 163, 184, 0.24)',
                borderRadius: 20,
                padding: 18,
                background: 'rgba(7, 17, 31, 0.7)',
                opacity: 0.76,
              }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <Pill label="Lumen" tone="default" />
                <Pill label="depois" tone="default" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Watch IA</div>
              <p style={{ ...helperTextStyle, marginTop: 8 }}>
                A mesma base podera evoluir para obras maiores quando o ecossistema estiver forte.
              </p>
            </div>
          </Grid>
        </Card>

        {selectedTrack ? (
          <Card
            title="Spotlight"
            subtitle="Faixa em destaque agora, com clima mais de vitrine do produto."
            accent="rgba(37, 99, 235, 0.4)"
          >
            <div
              style={{
                display: 'grid',
                gap: 22,
                gridTemplateColumns: 'minmax(180px, 220px) 1fr',
                alignItems: 'center',
              }}
            >
              <div style={{ ...buildArtworkStyle(selectedTrack.id), width: '100%', minWidth: 180 }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.18) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 18,
                    left: 18,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <Pill label="Spotlight" tone="accent" />
                  <Pill label={selectedTrack.visibilityState} tone="default" />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <Pill
                    label={selectedTrack.track?.aiDeclaration ? 'IA declarada' : 'Sem declaracao'}
                    tone={selectedTrack.track?.aiDeclaration ? 'success' : 'warning'}
                  />
                  <Pill
                    label={getAccessRoomMeta(selectedTrack.track?.accessRoom ?? 'standard').label}
                    tone={getAccessRoomMeta(selectedTrack.track?.accessRoom ?? 'standard').tone}
                  />
                  <Pill label={selectedTrack.contentState} tone="accent" />
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.1 }}>
                  {selectedTrack.title}
                </div>
                <div style={{ marginTop: 8, color: '#dbe7ff', fontSize: 18 }}>
                  {selectedTrack.track?.artistNameDisplay ?? 'Unknown artist'}
                </div>
                <div style={{ marginTop: 6, color: '#8da3ca' }}>
                  publicado por @{selectedTrack.creator.handle}
                </div>
                <p style={{ ...helperTextStyle, marginTop: 16 }}>
                  A vitrine do Echo precisa convencer rapido: faixa, artista, contexto e acoes
                  claras, tudo sem parecer dashboard.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <LinkButton href={`/track/${selectedTrack.id}`} label="Pagina da faixa" />
                  <LinkButton
                    href={`/artist/${selectedTrack.creator.id}`}
                    label="Perfil publico"
                    tone="secondary"
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {viewerMode === 'creator' ? (
          <Card
            title="Console local"
            subtitle="Status rapido do ambiente de desenvolvimento e do modo demo."
          >
            <Stack gap={14}>
              <Notice title="Modo local" tone={echoApi.demoUserId ? 'success' : 'warning'}>
                <div>
                  API: <strong>{echoApi.baseUrl}</strong>
                </div>
                <div>
                  Demo user: <strong>{echoApi.demoUserId ?? 'nao configurado'}</strong>
                </div>
                <div>
                  Demo creator: <strong>{echoApi.demoCreatorId ?? 'nao configurado'}</strong>
                </div>
              </Notice>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <ActionButton
                  label={showSetupDetails ? 'Ocultar detalhes tecnicos' : 'Mostrar detalhes tecnicos'}
                  tone="secondary"
                  onClick={() => setShowSetupDetails((current) => !current)}
                />
              </div>
              {showSetupDetails ? (
                <DemoSetupCard
                  apiBaseUrl={echoApi.baseUrl}
                  demoUserId={echoApi.demoUserId}
                  demoCreatorId={echoApi.demoCreatorId}
                  showCreator={activeTab === 'upload'}
                />
              ) : null}
            </Stack>
          </Card>
        ) : null}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {visibleTabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              label={tab.label}
              description={TAB_COPY[tab.id].eyebrow}
            />
          ))}
        </div>

        {loading ? (
          <Card title="Loading Echo" subtitle="Fetching live local data from the API.">
            <p style={helperTextStyle}>The preview is pulling tracks, categories and creators now.</p>
          </Card>
        ) : null}

        {error ? (
          <Notice title="Falha de leitura de dados" tone="danger">
            {error}
          </Notice>
        ) : null}
        {!loading && activeTab === 'feed' ? (
          <Stack gap={18}>
            <Grid min={250}>
              <Card
                title="Ouvir agora"
                subtitle="Abertura da sessao para prender atencao rapido."
                accent="rgba(16, 185, 129, 0.28)"
              >
                <Stack gap={10}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Pill label="Abertura do feed" tone="success" />
                    <Pill label={`${listenerFeedTracks.length} visiveis`} tone="accent" />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>
                    {listenerFeedTracks[0]?.title ?? 'Sem faixa de abertura'}
                  </div>
                  <div style={{ color: '#c6d4ee' }}>
                    {listenerFeedTracks[0]?.track?.artistNameDisplay ?? 'Catalogo ainda aquecendo'}
                  </div>
                  <p style={helperTextStyle}>
                    O Echo precisa fazer o usuario sentir em segundos que aqui existe musica nova
                    que vale uma escuta completa.
                  </p>
                </Stack>
              </Card>

              <Card
                title="Boas para save"
                subtitle="Faixas que ja ajudam a construir habito."
                accent="rgba(37, 99, 235, 0.28)"
              >
                <Stack gap={10}>
                  {(savedTracks.length ? savedTracks.map((entry) => entry.content) : listenerFeedTracks.slice(0, 2)).slice(0, 2).map((track) => (
                    <div key={track.id} style={{ display: 'grid', gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>{track.title}</div>
                      <div style={{ color: '#8da3ca' }}>
                        {track.track?.artistNameDisplay ?? 'Unknown artist'} / @{track.creator.handle}
                      </div>
                    </div>
                  ))}
                  <p style={helperTextStyle}>
                    Aqui fica o sinal de que o Echo nao e so curiosidade. Ele precisa ter coisas
                    para guardar e voltar depois.
                  </p>
                </Stack>
              </Card>

              <Card
                title="Artistas para acompanhar"
                subtitle="Nomes que ja comecam a parecer promissores."
                accent="rgba(168, 85, 247, 0.24)"
              >
                <Stack gap={10}>
                  {artistsToWatch.map((creator) => (
                    <div key={creator.id} style={{ display: 'grid', gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                      <div style={{ color: '#8da3ca' }}>
                        @{creator.handle} / {creator.publishedContentCountCached} faixas
                      </div>
                    </div>
                  ))}
                  <p style={helperTextStyle}>
                    O follow aqui precisa parecer descoberta antecipada, nao so uma acao tecnica.
                  </p>
                </Stack>
              </Card>

              <Card
                title="Exclusoes"
                subtitle="Lugar visivel para o Echo aprender tambem com o que voce nao quer."
                accent="rgba(239, 68, 68, 0.28)"
              >
                <Stack gap={10}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Pill label={`${hiddenTrackIds.length} faixas ocultas`} tone="warning" />
                    <Pill label={`${mutedCreatorIds.length} artistas silenciados`} tone="danger" />
                    <Pill label={`${hiddenCategoryIds.length} estilos ocultos`} tone="warning" />
                    <Pill
                      label={`${deprioritizedCategoryIds.length} menos disso`}
                      tone="accent"
                    />
                  </div>
                  {hiddenTrackIds.length === 0 &&
                  mutedCreatorIds.length === 0 &&
                  hiddenCategoryIds.length === 0 &&
                  deprioritizedCategoryIds.length === 0 ? (
                    <p style={helperTextStyle}>
                      Quando o listener esconder algo, esse centro passa a mostrar o que saiu do
                      fluxo e permite trazer de volta sem confusao.
                    </p>
                  ) : null}
                  {Object.entries(hiddenTrackCatalog).slice(0, 2).map(([trackId, label]) => (
                    <div key={trackId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ color: '#d8e5ff' }}>{label}</div>
                      <ActionButton
                        label="Restaurar"
                        tone="secondary"
                        onClick={() => restoreHiddenTrack(trackId)}
                      />
                    </div>
                  ))}
                  {Object.entries(mutedCreatorCatalog).slice(0, 2).map(([creatorId, label]) => (
                    <div key={creatorId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ color: '#d8e5ff' }}>@{label}</div>
                      <ActionButton
                        label="Reativar"
                        tone="secondary"
                        onClick={() => restoreMutedCreator(creatorId)}
                      />
                    </div>
                  ))}
                  {hiddenTrackIds.length > 0 || mutedCreatorIds.length > 0 ? (
                    <ActionButton
                      label="Limpar exclusoes"
                      tone="secondary"
                      onClick={clearAllExclusions}
                    />
                  ) : null}
                </Stack>
              </Card>
            </Grid>

            <Grid min={360}>
            <Card
              title="Em reproducao"
              subtitle="Faixa atual com contexto claro e acoes centrais do ouvinte."
              accent="rgba(59, 130, 246, 0.5)"
            >
              {selectedTrack ? (
                <Stack gap={14}>
                  <div
                    style={{
                      display: 'grid',
                      gap: 18,
                      gridTemplateColumns: 'minmax(140px, 160px) 1fr',
                      alignItems: 'center',
                    }}
                  >
                    <div style={buildArtworkStyle(selectedTrack.id)}>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.22) 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 18,
                          right: 18,
                          bottom: 18,
                          display: 'grid',
                          gap: 6,
                        }}
                      >
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.75)' }} />
                        <div style={{ height: 6, width: '72%', borderRadius: 999, background: 'rgba(255,255,255,0.55)' }} />
                        <div style={{ height: 6, width: '52%', borderRadius: 999, background: 'rgba(255,255,255,0.35)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        <Pill label={selectedTrack.contentState} tone="accent" />
                        <Pill label={selectedTrack.visibilityState} tone="default" />
                        <Pill
                          label={getAccessRoomMeta(selectedTrack.track?.accessRoom ?? 'standard').label}
                          tone={getAccessRoomMeta(selectedTrack.track?.accessRoom ?? 'standard').tone}
                        />
                        {selectedTrack.primaryCategory ? (
                          <Pill label={selectedTrack.primaryCategory.displayName} tone="default" />
                        ) : null}
                        <Pill
                          label={selectedTrack.track?.aiDeclaration ? 'IA declarada' : 'Sem declaracao'}
                          tone={selectedTrack.track?.aiDeclaration ? 'success' : 'warning'}
                        />
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 800 }}>{selectedTrack.title}</div>
                      <div style={{ marginTop: 6, color: '#c6d4ee', fontSize: 16 }}>
                        {selectedTrack.track?.artistNameDisplay ?? 'Unknown artist'}
                      </div>
                      <div style={{ marginTop: 6, color: '#8da3ca' }}>
                        publicado por @{selectedTrack.creator.handle}
                      </div>
                      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedTrack.primaryCategory ? (
                          <Pill label={selectedTrack.primaryCategory.displayName} tone="accent" />
                        ) : (
                          categories.slice(0, 1).map((category) => (
                            <Pill key={category.id} label={category.displayName} tone="default" />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <p style={helperTextStyle}>
                    Esta area e o equivalente direto do fluxo principal do app: escolher uma faixa,
                    ouvir, salvar ou reportar, sempre escrevendo no backend real.
                  </p>
                  <div style={{ color: '#8da3ca', fontSize: 13, fontWeight: 700 }}>
                    Escuta
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label="Ouvir 15s"
                      tone="secondary"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 15000, 0.33, 'Sessao curta registrada')
                      }
                    />
                    <ActionButton
                      label="Ouvir 30s"
                      tone="secondary"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 30000, 0.66, 'Sessao media registrada')
                      }
                    />
                    <ActionButton
                      label="Ouvir ate o fim"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 45000, 1, 'Faixa concluida no player')
                      }
                    />
                  </div>
                  <div style={{ color: '#8da3ca', fontSize: 13, fontWeight: 700 }}>Acoes rapidas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label="Salvar no player"
                      onClick={() => handleSave(selectedTrack.id)}
                    />
                    <ActionButton
                      label="Menos disso"
                      tone="secondary"
                      onClick={() => handleDeprioritizeCategory(selectedTrack)}
                    />
                    <ActionButton
                      label="Ocultar faixa"
                      tone="secondary"
                      onClick={() => handleHideTrack(selectedTrack)}
                    />
                    <ActionButton
                      label="Ocultar estilo"
                      tone="secondary"
                      onClick={() => handleHideCategory(selectedTrack)}
                    />
                    <ActionButton
                      label="Silenciar artista"
                      tone="secondary"
                      onClick={() => handleMuteCreator(selectedTrack.creator)}
                    />
                    <ActionButton
                      label="Reportar"
                      tone="danger"
                      onClick={() =>
                        setReportComposerTrackId((current) =>
                          current === selectedTrack.id ? null : selectedTrack.id,
                        )
                      }
                    />
                  </div>
                  {reportComposerTrackId === selectedTrack.id ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {REPORT_REASON_OPTIONS.map((option) => (
                        <Chip
                          key={`${selectedTrack.id}-${option.reason}`}
                          label={option.label}
                          onClick={() => handleReport(selectedTrack.id, option.reason)}
                        />
                      ))}
                    </div>
                  ) : null}
                  {feedbackByTrack[selectedTrack.id] ? (
                    <Notice title="Ultima acao na faixa" tone="success">
                      {feedbackByTrack[selectedTrack.id]}
                    </Notice>
                  ) : null}
                </Stack>
              ) : (
                <p style={helperTextStyle}>No tracks available yet.</p>
              )}
            </Card>

            <Card title="Descoberta continua" subtitle="Faixas que sustentam a sensacao de novidade e profundidade.">
              <Stack gap={14}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.slice(0, 4).map((category) => (
                    <Pill key={category.id} label={category.displayName} tone="accent" />
                  ))}
                </div>
                <Notice title="Leitura do feed" tone="info">
                  O objetivo desta fila nao e mostrar tudo. E sugerir rapido que aqui existem
                  artistas novos, sons diferentes e algumas faixas que merecem save.
                </Notice>
                {listenerFeedTracks.length === 0 ? <p style={helperTextStyle}>No tracks seeded yet.</p> : null}
                {listenerFeedTracks.map((track, index) => (
                  <div
                    key={track.id}
                    style={{
                      border: '1px solid rgba(59, 130, 246, 0.18)',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(10, 22, 40, 0.7)',
                      outline:
                        selectedTrackId === track.id ? '2px solid rgba(59, 130, 246, 0.55)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ ...buildArtworkStyle(track.id), width: 64, minWidth: 64, borderRadius: 18 }} />
                          <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                              <Pill label={`Faixa ${index + 1}`} tone="default" />
                              {index < 3 ? <Pill label="Top da sessao" tone="accent" /> : null}
                              <Pill
                                label={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').label}
                                tone={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').tone}
                              />
                              {track.primaryCategory ? (
                                <Pill label={track.primaryCategory.displayName} tone="default" />
                              ) : null}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{track.title}</div>
                            <div style={{ marginTop: 4, color: '#d2dcf0' }}>
                              {track.track?.artistNameDisplay ?? 'Unknown artist'}
                            </div>
                            <div style={{ marginTop: 4, color: '#8da3ca' }}>@{track.creator.handle}</div>
                          </div>
                        </div>
                      </div>
                      <Pill
                        label={selectedTrackId === track.id ? 'Selecionada' : 'No feed'}
                        tone={selectedTrackId === track.id ? 'accent' : 'default'}
                      />
                    </div>
                    <div style={{ marginTop: 8, color: '#8da3ca' }}>
                      {track.contentState} / {track.visibilityState}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                      <ActionButton
                        label="Abrir player"
                        tone={selectedTrackId === track.id ? 'default' : 'secondary'}
                        onClick={() => setSelectedTrackId(track.id)}
                      />
                      <ActionButton label="Salvar" onClick={() => handleSave(track.id)} />
                      <ActionButton
                        label="Menos disso"
                        tone="secondary"
                        onClick={() => handleDeprioritizeCategory(track)}
                      />
                      <ActionButton
                        label="Ocultar"
                        tone="secondary"
                        onClick={() => handleHideTrack(track)}
                      />
                      <ActionButton
                        label="Ocultar estilo"
                        tone="secondary"
                        onClick={() => handleHideCategory(track)}
                      />
                      <ActionButton
                        label="Menos desse artista"
                        tone="secondary"
                        onClick={() => handleMuteCreator(track.creator)}
                      />
                      <ActionButton
                        label="Registrar play"
                        tone="secondary"
                        onClick={() =>
                          handlePlaybackPreset(track.id, 20000, 0.66, 'Playback de teste registrado')
                        }
                      />
                      <ActionButton
                        label="Reportar"
                        tone="danger"
                        onClick={() =>
                          setReportComposerTrackId((current) =>
                            current === track.id ? null : track.id,
                          )
                        }
                      />
                      <LinkButton href={`/track/${track.id}`} label="Pagina da faixa" tone="secondary" />
                    </div>
                    {reportComposerTrackId === track.id ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                        {REPORT_REASON_OPTIONS.map((option) => (
                          <Chip
                            key={`${track.id}-${option.reason}`}
                            label={option.label}
                            onClick={() => handleReport(track.id, option.reason)}
                          />
                        ))}
                      </div>
                    ) : null}
                    {feedbackByTrack[track.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>{feedbackByTrack[track.id]}</p>
                    ) : null}
                  </div>
                ))}
                {reserveTracks.length > 0 ? (
                  <Notice title="Reserva do catalogo" tone="warning">
                    Existem {reserveTracks.length} faixas fora da abertura visivel. Elas servem para
                    refresh do feed e para evitar que a primeira sessao fique repetitiva cedo demais.
                  </Notice>
                ) : null}
              </Stack>
            </Card>
          </Grid>
          </Stack>
        ) : null}

        {!loading && viewerMode === 'listener' && activeTab === 'explore' ? (
          <Stack gap={18}>
            <Card
              title="Rooms"
              subtitle="O feed principal fica limpo. As outras salas so entram quando voce abre a porta."
            >
              <Stack gap={12}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Pill label="Main sempre ativa" tone="success" />
                  <Pill
                    label={`${enabledAccessRooms.length - 1} salas abertas`}
                    tone={enabledAccessRooms.length > 1 ? 'accent' : 'default'}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ACCESS_ROOMS.map((room) => (
                    <Chip
                      key={room.id}
                      selected={enabledAccessRooms.includes(room.id)}
                      label={room.label}
                      onClick={() => toggleAccessRoom(room.id)}
                    />
                  ))}
                </div>
                <p style={helperTextStyle}>
                  O Main e o caminho normal. Kids, Parody, Clone-inspired, Explicit e Restricted
                  devem ser escolha consciente, nunca ruido automatico.
                </p>
              </Stack>
            </Card>

            <ListenerLibrary
              savedTracks={savedTracks}
              followedCreators={followedCreators}
              creators={creators}
              libraryMemory={libraryMemory}
              hiddenTrackCatalog={hiddenTrackCatalog}
              mutedCreatorCatalog={mutedCreatorCatalog}
              hiddenCategoryCatalog={hiddenCategoryCatalog}
              deprioritizedCategoryCatalog={deprioritizedCategoryCatalog}
              restoreHiddenTrack={restoreHiddenTrack}
              restoreMutedCreator={restoreMutedCreator}
              restoreHiddenCategory={restoreHiddenCategory}
              restoreDeprioritizedCategory={restoreDeprioritizedCategory}
              clearAllExclusions={clearAllExclusions}
              cycleTrackPublicFolder={cycleTrackPublicFolder}
              toggleTrackOffline={toggleTrackOffline}
              toggleTrackShared={toggleTrackShared}
              toggleBorrowedCreator={toggleBorrowedCreator}
              publicUserId={echoApi.demoUserId}
            />

            <Grid min={360}>

            <Card
              title="Separated rooms"
              subtitle="Conteudos fora do padrao vivem aqui em vez de invadir o feed principal."
            >
              <Stack gap={12}>
                {ACCESS_ROOMS.filter((room) => room.id !== 'standard').map((room) => {
                  const roomTracks = separatedRoomTracks.filter(
                    (track) => (track.track?.accessRoom ?? 'standard') === room.id,
                  );

                  return (
                    <div
                      key={room.id}
                      style={{
                        border: '1px solid #1d3557',
                        borderRadius: 18,
                        padding: 16,
                        background: 'rgba(7, 17, 31, 0.82)',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        <Pill label={room.label} tone={room.tone} />
                        <Pill
                          label={enabledAccessRooms.includes(room.id) ? 'Aberta' : 'Fechada'}
                          tone={enabledAccessRooms.includes(room.id) ? 'accent' : 'default'}
                        />
                        <Pill label={`${roomTracks.length} faixas`} tone="default" />
                      </div>
                      <p style={{ ...helperTextStyle, marginBottom: 10 }}>{room.note}</p>
                      {roomTracks.slice(0, 3).map((track) => (
                        <div key={track.id} style={{ marginTop: 10 }}>
                          <div style={{ fontWeight: 700 }}>{track.title}</div>
                          <div style={{ color: '#8da3ca' }}>
                            {track.track?.artistNameDisplay ?? 'Unknown artist'} / @{track.creator.handle}
                          </div>
                        </div>
                      ))}
                      {roomTracks.length === 0 ? (
                        <p style={{ ...helperTextStyle, marginTop: 8 }}>
                          Nada ativo nesta sala ainda.
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </Stack>
            </Card>

            <Card
              title="Collection lanes"
              subtitle="Blocos simples para ajudar o usuario a entender o catalogo como colecao, nao como lista tecnica."
            >
              <Grid min={220}>
                <Card title="Late night" subtitle="Dark, ambient e cinematico.">
                  <p style={helperTextStyle}>
                    Bom para mostrar identidade e diferenciar Echo de uma playlist generica.
                  </p>
                </Card>
                <Card title="Repeat and chill" subtitle="Lo-fi, soft electronic e faixas para save.">
                  <p style={helperTextStyle}>
                    Essa lane deve ajudar o usuario a voltar, nao apenas testar uma vez.
                  </p>
                </Card>
                <Card title="Edge of feed" subtitle="Experimental, mas ainda ouvivel.">
                  <p style={helperTextStyle}>
                    Serve para provar novidade sem transformar o app em caos.
                  </p>
                </Card>
              </Grid>
            </Card>

            <Card
              title="Discovery map"
              subtitle="Taxonomia inicial do Echo organizada com mais cara de descoberta editorial."
            >
              <Stack gap={12}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <Pill label={`Rank ${category.rankOrder}`} tone="accent" />
                      <Pill
                        label={category.activeFlag ? 'Em circulacao' : 'Dormindo'}
                        tone={category.activeFlag ? 'success' : 'warning'}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontWeight: 700 }}>{category.displayName}</div>
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>{category.slug}</div>
                    <p style={{ ...helperTextStyle, marginTop: 10 }}>
                      Categoria pronta para ajudar o algoritmo a distribuir descoberta com menos
                      ruido no inicio.
                    </p>
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid>
          </Stack>
        ) : null}
        {!loading && viewerMode === 'listener' && activeTab === 'creators' ? (
          <Grid min={360}>
            <Grid min={220}>
              <MetricCard
                label="Ja seguindo"
                value={followedCreators.length}
                note="Nomes que o listener demo ja marcou para voltar depois."
              />
              <MetricCard
                label="Primeira aposta"
                value={firstBetCreators.length}
                note="Creators que ainda nao foram seguidos, mas ja parecem bons candidatos."
              />
              <MetricCard
                label="Mais ativos"
                value={risingCreators[0]?.publishedContentCountCached ?? 0}
                note="Quantidade de faixas do creator mais produtivo no catalogo atual."
              />
            </Grid>

            <Card
              title="Radar"
              subtitle="Creators que ja estao no radar do listener demo, com mais cara de talento acompanhado."
            >
              <Stack gap={12}>
                {followedCreators[0] ? (
                  <div
                    style={{
                      display: 'grid',
                      gap: 16,
                      gridTemplateColumns: '96px 1fr',
                      padding: 16,
                      borderRadius: 20,
                      background: 'rgba(10, 22, 40, 0.72)',
                      border: '1px solid rgba(59, 130, 246, 0.24)',
                    }}
                  >
                    <div style={{ ...buildArtworkStyle(followedCreators[0].creator.id), width: 96, minWidth: 96, borderRadius: 20 }} />
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        <Pill label="Following" tone="success" />
                        <Pill label="Em observacao" tone="accent" />
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>
                        {followedCreators[0].creator.displayName}
                      </div>
                      <div style={{ marginTop: 4, color: '#8da3ca' }}>
                        @{followedCreators[0].creator.handle}
                      </div>
                    </div>
                  </div>
                ) : null}
                {followedCreators.length === 0 ? (
                  <p style={helperTextStyle}>
                    O listener demo ainda nao seguiu nenhum creator. Este bloco deve virar um
                    painel de nomes que merecem retorno.
                  </p>
                ) : null}
                {followedCreators.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <Pill label="Following" tone="success" />
                    </div>
                    <div style={{ fontWeight: 700 }}>{entry.creator.displayName}</div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{entry.creator.handle}</div>
                    <div style={{ marginTop: 12 }}>
                      <LinkButton href={`/artist/${entry.creator.id}`} label="Perfil publico" tone="secondary" />
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>

            <Card
              title="Primeira aposta"
              subtitle="O Echo precisa mostrar alguns nomes que ainda nao foram seguidos, mas ja pedem curiosidade."
            >
              <Stack gap={12}>
                {firstBetCreators.map((creator) => (
                  <div
                    key={creator.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                        <div style={{ marginTop: 4, color: '#8da3ca' }}>@{creator.handle}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <Pill label={creator.creatorTier} tone={getCreatorTierTone(creator.creatorTier)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 8, color: '#8da3ca' }}>
                      {creator.publishedContentCountCached} faixas publicadas /{' '}
                      {creator.followerCountCached} seguidores
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        <ActionButton label="Seguir cedo" onClick={() => handleFollow(creator.id)} />
                        <LinkButton href={`/artist/${creator.id}`} label="Perfil publico" tone="secondary" />
                      </div>
                    </div>
                    {feedbackByCreator[creator.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>
                        {feedbackByCreator[creator.id]}
                      </p>
                    ) : null}
                  </div>
                ))}
                <p style={helperTextStyle}>
                  Seguir no Echo precisa parecer descoberta antecipada. O usuario nao esta apenas
                  guardando um nome. Ele esta dizendo: quero voltar antes que esse creator estoure.
                </p>
                {echoApi.demoUserId ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <LinkButton href={`/library/${echoApi.demoUserId}`} label="Biblioteca publica" />
                  </div>
                ) : null}
              </Stack>
            </Card>

            <Card
              title="Creator board"
              subtitle="Base atual de creators com identidade, status e sinais claros de crescimento."
            >
              <Stack gap={12}>
                {risingCreators.map((creator) => (
                  <div
                    key={creator.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ ...buildArtworkStyle(creator.id), width: 64, minWidth: 64, borderRadius: 18 }} />
                        <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <Pill label={creator.creatorTier} tone={getCreatorTierTone(creator.creatorTier)} />
                        <Pill label={creator.creatorStatus} tone="default" />
                      </div>
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{creator.handle}</div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>
                      {creator.followerCountCached} followers / {creator.publishedContentCountCached}{' '}
                      items
                    </div>
                    {creator.bio ? (
                      <p style={{ marginBottom: 0, color: '#c6d4ee' }}>{creator.bio}</p>
                    ) : null}
                    <div style={{ marginTop: 14 }}>
                      <ActionButton
                        label={followedCreatorIds.has(creator.id) ? 'Ja seguido' : 'Seguir'}
                        onClick={() => handleFollow(creator.id)}
                      />
                    </div>
                    {feedbackByCreator[creator.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>
                        {feedbackByCreator[creator.id]}
                      </p>
                    ) : null}
                  </div>
                ))}
                <p style={helperTextStyle}>
                  Este bloco precisa funcionar como uma pequena vitrine de talentos em ascensao:
                  poucos nomes, sinais simples e vontade de acompanhar.
                </p>
              </Stack>
            </Card>
          </Grid>
        ) : null}

        {!loading && viewerMode === 'creator' && activeTab === 'upload' ? (
          <CreatorWorkspace
            creators={creators}
            tracks={tracks}
            categories={categories}
            creatorId={creatorId}
            setCreatorId={setCreatorId}
            setupEmail={setupEmail}
            setSetupEmail={setSetupEmail}
            setupDisplayName={setupDisplayName}
            setSetupDisplayName={setSetupDisplayName}
            setupHandle={setupHandle}
            setSetupHandle={setSetupHandle}
            setupBio={setupBio}
            setSetupBio={setSetupBio}
            setupResultMessage={setupResultMessage}
            creatingCreator={creatingCreator}
            onCreateCreator={handleCreatorSetup}
            title={title}
            setTitle={setTitle}
            artistNameDisplay={artistNameDisplay}
            setArtistNameDisplay={setArtistNameDisplay}
            description={description}
            setDescription={setDescription}
            sourceToolOptional={sourceToolOptional}
            setSourceToolOptional={setSourceToolOptional}
            primaryCategoryId={primaryCategoryId}
            setPrimaryCategoryId={setPrimaryCategoryId}
            aiDeclaration={aiDeclaration}
            setAiDeclaration={setAiDeclaration}
            accessRoom={accessRoom}
            setAccessRoom={setAccessRoom}
            uploadMessage={uploadMessage}
            submitting={submitting}
            onSubmitTrack={handleSubmitTrack}
          />
        ) : null}
      </Stack>
    </PageShell>
  );
}
