import type { EchoCreator, EchoTrack } from './api';
import type { EchoLivePlan } from './use-echo-community-state';

export interface ArtistTimelineItem {
  id: string;
  title: string;
  note: string;
  kind: 'show' | 'drop' | 'radio';
}

export interface ArtistSignalItem {
  id: string;
  label: string;
  value: string;
}

export interface FeedEventHint {
  id: string;
  label: string;
  note: string;
}

export interface LiveRoomCandidate {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  kind: 'radio' | 'show' | 'drop';
  title: string;
  note: string;
  audienceLabel: string;
  timingLabel: string;
  ctaLabel: string;
  source: 'following' | 'global';
  featuredTrackId: string | null;
}

export interface ReleaseCardTheme {
  backgroundColor: string;
  borderColor: string;
  eyebrowColor: string;
}

export function buildArtistTimeline(creator: EchoCreator, tracks: EchoTrack[]): ArtistTimelineItem[] {
  const featured = tracks[0];
  const upcomingBase = creator.displayName;

  return [
    {
      id: `${creator.id}-radio`,
      title: `${upcomingBase} radio ao vivo`,
      note: 'hoje 21:30 · ao vivo leve · sem arquivo',
      kind: 'radio',
    },
    {
      id: `${creator.id}-show`,
      title: `${upcomingBase} show de estreia`,
      note: 'amanha 20:00 · conversa + faixas novas',
      kind: 'show',
    },
    {
      id: `${creator.id}-drop`,
      title: featured ? `${featured.title} ganha nova janela` : `${upcomingBase} prepara novo drop`,
      note: 'domingo 18:00 · entra no feed se estiver forte',
      kind: 'drop',
    },
  ];
}

export function buildArtistSignals(creator: EchoCreator, tracks: EchoTrack[]): ArtistSignalItem[] {
  return [
    {
      id: 'launches',
      label: 'Lançamentos',
      value: String(tracks.length),
    },
    {
      id: 'circle',
      label: 'No circulo',
      value: `${Math.max(3, Math.min(18, creator.followerCountCached || 0) + 3)} ouvintes`,
    },
    {
      id: 'heat',
      label: 'Calor',
      value: tracks.length > 2 ? 'subindo' : 'novo',
    },
  ];
}

export function getFrontHorizon(mode: 'listener' | 'creator') {
  if (mode === 'creator') {
    return [
      {
        id: 'echo',
        title: 'Echo',
        note: 'ativo agora · musica IA',
        state: 'live' as const,
      },
      {
        id: 'pulse',
        title: 'Pulse',
        note: 'entra depois · cortes e shorts',
        state: 'horizon' as const,
      },
      {
        id: 'lumen',
        title: 'Lumen',
        note: 'mais tarde · obras longas',
        state: 'horizon' as const,
      },
    ];
  }

  return [
    {
      id: 'echo',
      title: 'Echo',
      note: 'musica viva agora',
      state: 'live' as const,
    },
    {
      id: 'pulse',
      title: 'Pulse',
      note: 'mais frentes chegando',
      state: 'hint' as const,
    },
    {
      id: 'lumen',
      title: 'Lumen',
      note: 'horizonte do ecossistema',
      state: 'hint' as const,
    },
  ];
}

export function buildFeedEventHint(
  track: EchoTrack,
  livePlansByCreatorId: Record<string, EchoLivePlan[]>,
  feedMode: 'following' | 'discover',
): FeedEventHint | null {
  const creatorPlans = livePlansByCreatorId[track.creator.id] ?? [];
  if (creatorPlans[0]) {
    return {
      id: creatorPlans[0].id,
      label: creatorPlans[0].mode === 'radio' ? 'ao vivo' : creatorPlans[0].mode,
      note: creatorPlans[0].note,
    };
  }

  if (feedMode === 'discover') {
    return {
      id: `${track.id}-drop`,
      label: 'drop',
      note: 'janela curta forte agora',
    };
  }

  return null;
}

export function getReleaseCardTheme(track: EchoTrack): ReleaseCardTheme {
  const room = track.track?.accessRoom ?? 'standard';

  if (room === 'kids') {
    return {
      backgroundColor: 'rgba(22, 101, 52, 0.16)',
      borderColor: 'rgba(74, 222, 128, 0.36)',
      eyebrowColor: '#86efac',
    };
  }

  if (room === 'parody') {
    return {
      backgroundColor: 'rgba(91, 33, 182, 0.14)',
      borderColor: 'rgba(196, 181, 253, 0.34)',
      eyebrowColor: '#c4b5fd',
    };
  }

  if (room === 'clone_inspired') {
    return {
      backgroundColor: 'rgba(51, 65, 85, 0.32)',
      borderColor: 'rgba(148, 163, 184, 0.34)',
      eyebrowColor: '#cbd5e1',
    };
  }

  if (room === 'explicit') {
    return {
      backgroundColor: 'rgba(127, 29, 29, 0.2)',
      borderColor: 'rgba(251, 113, 133, 0.34)',
      eyebrowColor: '#fda4af',
    };
  }

  return {
    backgroundColor: 'rgba(14, 116, 144, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.34)',
    eyebrowColor: '#7dd3fc',
  };
}

export function buildLiveRoomCandidates({
  creators,
  tracks,
  followedCreatorIds,
  livePlansByCreatorId,
}: {
  creators: EchoCreator[];
  tracks: EchoTrack[];
  followedCreatorIds: Set<string>;
  livePlansByCreatorId: Record<string, EchoLivePlan[]>;
}) {
  const tracksByCreatorId = new Map<string, EchoTrack[]>();
  for (const track of tracks) {
    const current = tracksByCreatorId.get(track.creator.id) ?? [];
    current.push(track);
    tracksByCreatorId.set(track.creator.id, current);
  }

  const candidates: LiveRoomCandidate[] = [];

  for (const creator of creators) {
    const creatorTracks = tracksByCreatorId.get(creator.id) ?? [];
    if (creatorTracks.length === 0) {
      continue;
    }

    const radioPlan = (livePlansByCreatorId[creator.id] ?? []).find((plan) => plan.mode === 'radio');
    const featuredTrack = creatorTracks[0] ?? null;
    const source = followedCreatorIds.has(creator.id) ? 'following' : 'global';

    candidates.push({
      id: radioPlan?.id ?? `${creator.id}-radio-default`,
      creatorId: creator.id,
      creatorName: creator.displayName,
      creatorHandle: creator.handle,
      kind: radioPlan?.mode ?? 'radio',
      title: radioPlan?.title ?? `${creator.displayName} em aura agora`,
      note: radioPlan?.note ?? 'ao vivo leve · sem arquivo · conversa e faixa em giro',
      audienceLabel: `${Math.max(8, (creator.followerCountCached ?? 0) + 6)} ouvindo`,
      timingLabel:
        radioPlan?.mode === 'show'
          ? 'comeca em breve'
          : radioPlan?.mode === 'drop'
            ? 'janela curta'
            : 'agora',
      ctaLabel: radioPlan?.mode === 'drop' ? 'lembrar' : 'entrar',
      source,
      featuredTrackId: featuredTrack?.id ?? null,
    });
  }

  return candidates.sort((left, right) => {
    if (left.source !== right.source) {
      return left.source === 'following' ? -1 : 1;
    }

    return left.creatorName.localeCompare(right.creatorName);
  });
}
