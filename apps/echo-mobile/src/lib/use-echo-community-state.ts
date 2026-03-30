import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EchoTrackComment {
  id: string;
  text: string;
  createdAt: string;
}

export interface EchoLivePlan {
  id: string;
  title: string;
  note: string;
  mode: 'radio' | 'show' | 'drop';
}

interface EchoCommunityState {
  likedTrackIds: string[];
  emojisByTrackId: Record<string, string[]>;
  commentsByTrackId: Record<string, EchoTrackComment[]>;
  remindersByItemId: string[];
  livePlansByCreatorId: Record<string, EchoLivePlan[]>;
}

const STORAGE_KEY = 'echo-mobile-community-state-v1';

const defaultState: EchoCommunityState = {
  likedTrackIds: [],
  emojisByTrackId: {},
  commentsByTrackId: {},
  remindersByItemId: [],
  livePlansByCreatorId: {},
};

export function useEchoCommunityState() {
  const [state, setState] = useState<EchoCommunityState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadState() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && active) {
          setState({
            ...defaultState,
            ...JSON.parse(stored),
          });
        }
      } catch {
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    }

    loadState();

    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (nextState: EchoCommunityState) => {
    setState(nextState);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {}
  }, []);

  const toggleTrackLike = useCallback(
    async (trackId: string) => {
      const liked = state.likedTrackIds.includes(trackId);
      const nextState: EchoCommunityState = {
        ...state,
        likedTrackIds: liked
          ? state.likedTrackIds.filter((id) => id !== trackId)
          : [...state.likedTrackIds, trackId],
      };
      await persist(nextState);
    },
    [persist, state],
  );

  const addTrackEmoji = useCallback(
    async (trackId: string, emoji: string) => {
      const current = state.emojisByTrackId[trackId] ?? [];
      const nextState: EchoCommunityState = {
        ...state,
        emojisByTrackId: {
          ...state.emojisByTrackId,
          [trackId]: [...current, emoji].slice(-12),
        },
      };
      await persist(nextState);
    },
    [persist, state],
  );

  const addTrackComment = useCallback(
    async (trackId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      const current = state.commentsByTrackId[trackId] ?? [];
      const nextState: EchoCommunityState = {
        ...state,
        commentsByTrackId: {
          ...state.commentsByTrackId,
          [trackId]: [
            {
              id: `${trackId}-${Date.now()}`,
              text: trimmed,
              createdAt: new Date().toISOString(),
            },
            ...current,
          ].slice(0, 8),
        },
      };
      await persist(nextState);
    },
    [persist, state],
  );

  const toggleReminder = useCallback(
    async (itemId: string) => {
      const active = state.remindersByItemId.includes(itemId);
      const nextState: EchoCommunityState = {
        ...state,
        remindersByItemId: active
          ? state.remindersByItemId.filter((id) => id !== itemId)
          : [...state.remindersByItemId, itemId],
      };
      await persist(nextState);
    },
    [persist, state],
  );

  const addLivePlan = useCallback(
    async (creatorId: string, plan: Omit<EchoLivePlan, 'id'>) => {
      const current = state.livePlansByCreatorId[creatorId] ?? [];
      const nextState: EchoCommunityState = {
        ...state,
        livePlansByCreatorId: {
          ...state.livePlansByCreatorId,
          [creatorId]: [
            {
              id: `${creatorId}-${Date.now()}`,
              ...plan,
            },
            ...current,
          ].slice(0, 6),
        },
      };
      await persist(nextState);
    },
    [persist, state],
  );

  return {
    hydrated,
    likedTrackIds: state.likedTrackIds,
    emojisByTrackId: state.emojisByTrackId,
    commentsByTrackId: state.commentsByTrackId,
    remindersByItemId: state.remindersByItemId,
    livePlansByCreatorId: state.livePlansByCreatorId,
    toggleTrackLike,
    addTrackEmoji,
    addTrackComment,
    toggleReminder,
    addLivePlan,
  };
}
