export const LISTENER_MEMORY_KEY = 'northstar.echo.listener-memory.v2';

export interface ListenerMemorySnapshot {
  hiddenTrackIds: string[];
  mutedCreatorIds: string[];
  hiddenTrackCatalog: Record<string, string>;
  mutedCreatorCatalog: Record<string, string>;
  hiddenCategoryIds: string[];
  deprioritizedCategoryIds: string[];
  hiddenCategoryCatalog: Record<string, string>;
  deprioritizedCategoryCatalog: Record<string, string>;
  trackSignals: Record<string, number>;
  creatorSignals: Record<string, number>;
  categorySignals: Record<string, number>;
  shortSessionTrackCounts: Record<string, number>;
  shortSessionCreatorCounts: Record<string, number>;
  shortSessionCategoryCounts: Record<string, number>;
}

export function createEmptyListenerMemory(): ListenerMemorySnapshot {
  return {
    hiddenTrackIds: [],
    mutedCreatorIds: [],
    hiddenTrackCatalog: {},
    mutedCreatorCatalog: {},
    hiddenCategoryIds: [],
    deprioritizedCategoryIds: [],
    hiddenCategoryCatalog: {},
    deprioritizedCategoryCatalog: {},
    trackSignals: {},
    creatorSignals: {},
    categorySignals: {},
    shortSessionTrackCounts: {},
    shortSessionCreatorCounts: {},
    shortSessionCategoryCounts: {},
  };
}

export function loadListenerMemory(): ListenerMemorySnapshot {
  if (typeof window === 'undefined') {
    return createEmptyListenerMemory();
  }

  const rawMemory = window.localStorage.getItem(LISTENER_MEMORY_KEY);

  if (!rawMemory) {
    return createEmptyListenerMemory();
  }

  try {
    const parsed = JSON.parse(rawMemory) as Partial<ListenerMemorySnapshot>;
    return {
      ...createEmptyListenerMemory(),
      ...parsed,
      hiddenTrackIds: parsed.hiddenTrackIds ?? [],
      mutedCreatorIds: parsed.mutedCreatorIds ?? [],
      hiddenTrackCatalog: parsed.hiddenTrackCatalog ?? {},
      mutedCreatorCatalog: parsed.mutedCreatorCatalog ?? {},
      hiddenCategoryIds: parsed.hiddenCategoryIds ?? [],
      deprioritizedCategoryIds: parsed.deprioritizedCategoryIds ?? [],
      hiddenCategoryCatalog: parsed.hiddenCategoryCatalog ?? {},
      deprioritizedCategoryCatalog: parsed.deprioritizedCategoryCatalog ?? {},
      trackSignals: parsed.trackSignals ?? {},
      creatorSignals: parsed.creatorSignals ?? {},
      categorySignals: parsed.categorySignals ?? {},
      shortSessionTrackCounts: parsed.shortSessionTrackCounts ?? {},
      shortSessionCreatorCounts: parsed.shortSessionCreatorCounts ?? {},
      shortSessionCategoryCounts: parsed.shortSessionCategoryCounts ?? {},
    };
  } catch {
    window.localStorage.removeItem(LISTENER_MEMORY_KEY);
    return createEmptyListenerMemory();
  }
}

export function persistListenerMemory(memory: ListenerMemorySnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LISTENER_MEMORY_KEY, JSON.stringify(memory));
}
