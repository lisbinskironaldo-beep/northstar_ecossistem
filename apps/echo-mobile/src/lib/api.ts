export interface EchoTrack {
  id: string;
  title: string;
  description?: string | null;
  contentState: string;
  visibilityState: string;
  createdAt: string;
  creator: {
    id: string;
    displayName: string;
    handle: string;
  };
  track: {
    id: string;
    artistNameDisplay: string;
    aiDeclaration: boolean;
    sourceToolOptional?: string | null;
  } | null;
}

export interface EchoCategory {
  id: string;
  productSurface: string;
  slug: string;
  displayName: string;
  activeFlag: boolean;
  rankOrder: number;
}

export interface EchoCreator {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  bio?: string | null;
  creatorStatus: string;
  creatorTier: string;
  primaryFront: string;
  followerCountCached: number;
  publishedContentCountCached: number;
  createdAt: string;
}

export interface EchoUser {
  id: string;
  email: string | null;
  accountStatus: string;
  country: string | null;
  preferredLanguage: string | null;
  createdAt: string;
  trustLevel: string;
}

export interface SavedTrackEntry {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
  content: EchoTrack;
}

export interface FollowedCreatorEntry {
  id: string;
  userId: string;
  creatorId: string;
  createdAt: string;
  creator: EchoCreator;
}

export interface SaveTrackResult {
  id: string;
  userId: string;
  contentId: string;
  createdAt: string;
  alreadySaved: boolean;
}

export interface FollowCreatorResult {
  id: string;
  userId: string;
  creatorId: string;
  createdAt: string;
  alreadyFollowing: boolean;
}

export type ReportReason =
  | 'not_ai_content'
  | 'duplicate_or_spam'
  | 'abusive'
  | 'impersonation'
  | 'rights_or_ownership_issue'
  | 'adult_or_prohibited'
  | 'low_quality_spam';

export interface ReportResult {
  id: string;
  reporterUserId: string | null;
  contentId: string | null;
  creatorId: string | null;
  reportReason: ReportReason;
  reportSource: 'user' | 'system' | 'admin';
  reportStatus: string;
  createdAt: string;
}

export interface RecordPlaybackPayload {
  userId?: string;
  listenedMs: number;
  completionRatio: number;
  replayCountInSession?: number;
  sourceContext?: string;
}

export interface CreateTrackPayload {
  creatorId: string;
  title: string;
  description?: string;
  primaryCategoryId?: string;
  artistNameDisplay: string;
  aiDeclaration: boolean;
  sourceToolOptional?: string;
}

export interface RegisterUserPayload {
  email: string;
  country?: string;
  preferredLanguage?: string;
}

export interface CreateCreatorProfilePayload {
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  primaryFront?: 'echo' | 'pulse' | 'lumen';
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';
const DEMO_USER_ID = process.env.EXPO_PUBLIC_DEMO_USER_ID?.trim();
const DEMO_CREATOR_ID = process.env.EXPO_PUBLIC_DEMO_CREATOR_ID?.trim();

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const echoApi = {
  baseUrl: API_BASE_URL,
  demoUserId: DEMO_USER_ID,
  demoCreatorId: DEMO_CREATOR_ID,
  getTracks() {
    return fetchJson<EchoTrack[]>('/content/tracks?surface=echo&limit=20');
  },
  getSavedTracks(userId = DEMO_USER_ID) {
    if (!userId) {
      throw new Error('EXPO_PUBLIC_DEMO_USER_ID is required to load saved tracks');
    }

    return fetchJson<SavedTrackEntry[]>(`/content/users/${userId}/saves`);
  },
  getCategories() {
    return fetchJson<EchoCategory[]>('/content/categories?surface=echo');
  },
  getCreators() {
    return fetchJson<EchoCreator[]>('/creators');
  },
  getFollowedCreators(userId = DEMO_USER_ID) {
    if (!userId) {
      throw new Error('EXPO_PUBLIC_DEMO_USER_ID is required to load followed creators');
    }

    return fetchJson<FollowedCreatorEntry[]>(`/creators/users/${userId}/follows`);
  },
  createTrack(payload: CreateTrackPayload) {
    return fetchJson<EchoTrack>('/content/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
  saveTrack(contentId: string, userId = DEMO_USER_ID) {
    if (!userId) {
      throw new Error('EXPO_PUBLIC_DEMO_USER_ID is required to save a track in the shell app');
    }

    return fetchJson<SaveTrackResult>(`/content/tracks/${contentId}/saves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  },
  followCreator(creatorId: string, userId = DEMO_USER_ID) {
    if (!userId) {
      throw new Error(
        'EXPO_PUBLIC_DEMO_USER_ID is required to follow a creator in the shell app',
      );
    }

    return fetchJson<FollowCreatorResult>(`/creators/${creatorId}/follows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  },
  recordPlayback(contentId: string, payload: RecordPlaybackPayload) {
    return fetchJson(`/content/tracks/${contentId}/playbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
  reportTrack(
    contentId: string,
    reportReason: ReportReason,
    reporterUserId = DEMO_USER_ID,
  ) {
    if (!reporterUserId) {
      throw new Error('EXPO_PUBLIC_DEMO_USER_ID is required to report a track in the shell app');
    }

    return fetchJson<ReportResult>('/trust/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reporterUserId,
        contentId,
        reportReason,
        reportSource: 'user',
      }),
    });
  },
  registerUser(payload: RegisterUserPayload) {
    return fetchJson<EchoUser>('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
  createCreatorProfile(payload: CreateCreatorProfilePayload) {
    return fetchJson<EchoCreator>('/creators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
};
