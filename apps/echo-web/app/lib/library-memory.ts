import { EchoCreator, SavedTrackEntry } from './api';

export const LIBRARY_MEMORY_KEY = 'northstar.echo.library-memory.v1';

export interface PublicFolderDefinition {
  id: string;
  label: string;
  note: string;
}

export interface SharedLaneDefinition {
  id: string;
  label: string;
  note: string;
}

export const PUBLIC_LIBRARY_FOLDERS: PublicFolderDefinition[] = [
  { id: 'front-row', label: 'Front row', note: 'As faixas que deveriam representar o gosto publico.' },
  { id: 'after-hours', label: 'After hours', note: 'Mais clima, menos pressa.' },
  { id: 'soft-loop', label: 'Soft loop', note: 'Voltar sem cansar.' },
];

export const SHARED_LIBRARY_LANES: SharedLaneDefinition[] = [
  { id: 'night-signal', label: 'Night signal', note: 'Escuta coletiva noturna.' },
  { id: 'study-drift', label: 'Study drift', note: 'Baixo atrito para rotina.' },
  { id: 'creator-watch', label: 'Creator watch', note: 'Nomes para acompanhar cedo.' },
];

export interface LibraryMemorySnapshot {
  publicTrackFolderById: Record<string, string>;
  offlineTrackIds: string[];
  sharedTrackIds: string[];
  borrowedCreatorIds: string[];
}

export interface ResolvedPublicFolder {
  id: string;
  label: string;
  note: string;
  entries: SavedTrackEntry[];
}

export function createEmptyLibraryMemory(): LibraryMemorySnapshot {
  return {
    publicTrackFolderById: {},
    offlineTrackIds: [],
    sharedTrackIds: [],
    borrowedCreatorIds: [],
  };
}

export function loadLibraryMemory(): LibraryMemorySnapshot {
  if (typeof window === 'undefined') {
    return createEmptyLibraryMemory();
  }

  const rawMemory = window.localStorage.getItem(LIBRARY_MEMORY_KEY);

  if (!rawMemory) {
    return createEmptyLibraryMemory();
  }

  try {
    const parsed = JSON.parse(rawMemory) as Partial<LibraryMemorySnapshot>;
    return {
      ...createEmptyLibraryMemory(),
      ...parsed,
      publicTrackFolderById: parsed.publicTrackFolderById ?? {},
      offlineTrackIds: parsed.offlineTrackIds ?? [],
      sharedTrackIds: parsed.sharedTrackIds ?? [],
      borrowedCreatorIds: parsed.borrowedCreatorIds ?? [],
    };
  } catch {
    window.localStorage.removeItem(LIBRARY_MEMORY_KEY);
    return createEmptyLibraryMemory();
  }
}

export function persistLibraryMemory(memory: LibraryMemorySnapshot) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LIBRARY_MEMORY_KEY, JSON.stringify(memory));
}

export function resolvePublicFolders(
  savedTracks: SavedTrackEntry[],
  libraryMemory: LibraryMemorySnapshot,
): ResolvedPublicFolder[] {
  return PUBLIC_LIBRARY_FOLDERS.map((folder) => ({
    ...folder,
    entries: savedTracks.filter((entry) => libraryMemory.publicTrackFolderById[entry.content.id] === folder.id),
  }));
}

export function resolveSharedEntries(
  savedTracks: SavedTrackEntry[],
  libraryMemory: LibraryMemorySnapshot,
) {
  return SHARED_LIBRARY_LANES.map((lane) => ({
    ...lane,
    entries: savedTracks.filter((entry) => libraryMemory.sharedTrackIds.includes(entry.content.id)).slice(0, 6),
  }));
}

export function resolveBorrowedCreators(
  creators: EchoCreator[],
  libraryMemory: LibraryMemorySnapshot,
) {
  return creators.filter((creator) => libraryMemory.borrowedCreatorIds.includes(creator.id));
}

export function cyclePublicFolder(
  trackId: string,
  libraryMemory: LibraryMemorySnapshot,
): Record<string, string> {
  const currentFolder = libraryMemory.publicTrackFolderById[trackId];
  const currentIndex = PUBLIC_LIBRARY_FOLDERS.findIndex((folder) => folder.id === currentFolder);
  const nextIndex = currentIndex + 1;

  if (nextIndex >= PUBLIC_LIBRARY_FOLDERS.length) {
    const next = { ...libraryMemory.publicTrackFolderById };
    delete next[trackId];
    return next;
  }

  return {
    ...libraryMemory.publicTrackFolderById,
    [trackId]: PUBLIC_LIBRARY_FOLDERS[nextIndex === -1 ? 0 : nextIndex].id,
  };
}
