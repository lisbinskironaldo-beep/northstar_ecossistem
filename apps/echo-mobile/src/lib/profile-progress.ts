import type { EchoTrack, FollowedCreatorEntry, SavedTrackEntry } from './api';
import type { useEchoCommunityState } from './use-echo-community-state';

export type EchoProfileLevelId = 'none' | 'bronze' | 'silver' | 'gold';

export interface EchoProfileLevel {
  id: EchoProfileLevelId;
  title: string;
  tierLabel: string;
  note: string;
}

export interface EchoProfileNumbers {
  publishedTracks: number;
  followingCount: number;
  libraryCount: number;
  favoritesCount: number;
  followerCount: number;
  reactionCount: number;
}

const levelMap: Record<EchoProfileLevelId, EchoProfileLevel> = {
  none: {
    id: 'none',
    title: 'Sem nivel',
    tierLabel: 'Inicio',
    note: 'Comeca a usar, salva o que gosta e ativa o modo profissional quando quiser publicar.',
  },
  bronze: {
    id: 'bronze',
    title: 'Bronze',
    tierLabel: 'Nivel III',
    note: 'Conta ativa, perfil cuidado e primeiro sinal real de catalogo ou de gosto consistente.',
  },
  silver: {
    id: 'silver',
    title: 'Prata',
    tierLabel: 'Nivel II',
    note: 'Volta com frequencia, publica com criterio e interage sem ruído nem abuso.',
  },
  gold: {
    id: 'gold',
    title: 'Ouro',
    tierLabel: 'Nivel I',
    note: 'Catalogo forte, boa recepcao, rotina saudavel e qualidade acima de volume.',
  },
};

export function buildProfileNumbers(input: {
  tracks: EchoTrack[];
  savedTracks: SavedTrackEntry[];
  followedCreators: FollowedCreatorEntry[];
  community: ReturnType<typeof useEchoCommunityState>;
}) {
  const reactionCount =
    input.community.likedTrackIds.length +
    Object.values(input.community.emojisByTrackId).reduce((sum, emojis) => sum + emojis.length, 0) +
    Object.values(input.community.commentsByTrackId).reduce((sum, comments) => sum + comments.length, 0);

  const followerCount =
    input.tracks[0]?.creator.followerCountCached ??
    Math.min(input.tracks.length + Object.values(input.community.commentsByTrackId).length, 999);

  return {
    publishedTracks: input.tracks.length,
    followingCount: input.followedCreators.length,
    libraryCount: input.savedTracks.length,
    favoritesCount: input.savedTracks.length,
    followerCount,
    reactionCount,
  } satisfies EchoProfileNumbers;
}

export function resolveProfileLevel(input: EchoProfileNumbers) {
  const hasBaseListenerPulse =
    input.libraryCount >= 1 || input.followingCount >= 1 || input.reactionCount >= 2;

  if (
    input.publishedTracks >= 10 &&
    input.reactionCount >= 12 &&
    input.libraryCount >= 4 &&
    input.followingCount >= 3
  ) {
    return levelMap.gold;
  }

  if (
    input.publishedTracks >= 3 &&
    input.reactionCount >= 6 &&
    input.libraryCount >= 2 &&
    input.followingCount >= 2
  ) {
    return levelMap.silver;
  }

  if (input.publishedTracks >= 1 || hasBaseListenerPulse) {
    return levelMap.bronze;
  }

  return levelMap.none;
}

export function getProfileLevelAccent(level: EchoProfileLevelId) {
  if (level === 'gold') {
    return {
      tone: 'warm' as const,
      halo: '#fff7ed',
      line: '#fdba74',
    };
  }

  if (level === 'silver') {
    return {
      tone: 'soft' as const,
      halo: '#eff6ff',
      line: '#93c5fd',
    };
  }

  if (level === 'bronze') {
    return {
      tone: 'ok' as const,
      halo: '#f0fdfa',
      line: '#99f6e4',
    };
  }

  return {
    tone: 'default' as const,
    halo: '#ffffff',
    line: '#d7deea',
  };
}
