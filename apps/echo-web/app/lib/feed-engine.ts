import { EchoTrack, SavedTrackEntry } from './api';
import { AccessRoomId } from './access-rooms';

export interface ListenerFeedEngineInput {
  tracks: EchoTrack[];
  hiddenTrackIds: string[];
  mutedCreatorIds: string[];
  hiddenCategoryIds: string[];
  deprioritizedCategoryIds: string[];
  trackSignals: Record<string, number>;
  creatorSignals: Record<string, number>;
  categorySignals: Record<string, number>;
  shortSessionTrackCounts: Record<string, number>;
  shortSessionCreatorCounts: Record<string, number>;
  shortSessionCategoryCounts: Record<string, number>;
  savedTracks: SavedTrackEntry[];
  savedTrackIds: Set<string>;
  followedCreatorIds: Set<string>;
  enabledAccessRooms: AccessRoomId[];
}

function getCategoryId(track: EchoTrack) {
  return track.primaryCategory?.id ?? '';
}

export function getTrackSessionScore(track: EchoTrack, input: ListenerFeedEngineInput) {
  const categoryId = getCategoryId(track);
  const savedCategoryBoost = input.savedTracks.some(
    (entry) => entry.content.primaryCategory?.id === categoryId,
  )
    ? 2
    : 0;
  const savedTrackBoost = input.savedTrackIds.has(track.id) ? 3 : 0;
  const followedCreatorBoost = input.followedCreatorIds.has(track.creator.id) ? 2 : 0;
  const deprioritizedPenalty = input.deprioritizedCategoryIds.includes(categoryId) ? 4 : 0;
  const repeatedSkipPenalty =
    (input.shortSessionTrackCounts[track.id] ?? 0) * 3 +
    (input.shortSessionCreatorCounts[track.creator.id] ?? 0) * 2 +
    (input.shortSessionCategoryCounts[categoryId] ?? 0) * 2;

  return (
    (input.trackSignals[track.id] ?? 0) * 3 +
    (input.creatorSignals[track.creator.id] ?? 0) * 2 +
    (input.categorySignals[categoryId] ?? 0) * 2 +
    savedCategoryBoost +
    savedTrackBoost +
    followedCreatorBoost -
    deprioritizedPenalty -
    repeatedSkipPenalty
  );
}

export function buildRoomedTracks(input: ListenerFeedEngineInput) {
  return input.tracks.filter(
    (track) =>
      track.contentState === 'published' &&
      !input.hiddenTrackIds.includes(track.id) &&
      !input.mutedCreatorIds.includes(track.creator.id) &&
      !input.hiddenCategoryIds.includes(getCategoryId(track)),
  );
}

export function buildListenerFeedTracks(input: ListenerFeedEngineInput) {
  const filtered = input.tracks.filter(
    (track) =>
      track.contentState === 'published' &&
      track.visibilityState === 'visible' &&
      (track.track?.accessRoom ?? 'standard') === 'standard' &&
      !input.hiddenTrackIds.includes(track.id) &&
      !input.mutedCreatorIds.includes(track.creator.id) &&
      !input.hiddenCategoryIds.includes(getCategoryId(track)),
  );

  return filtered
    .slice()
    .sort((left, right) => getTrackSessionScore(right, input) - getTrackSessionScore(left, input));
}

export function buildReserveTracks(roomedTracks: EchoTrack[]) {
  return roomedTracks.filter(
    (track) =>
      track.visibilityState !== 'visible' && (track.track?.accessRoom ?? 'standard') === 'standard',
  );
}

export function buildSeparatedRoomTracks(
  roomedTracks: EchoTrack[],
  enabledAccessRooms: AccessRoomId[],
) {
  return roomedTracks.filter((track) =>
    enabledAccessRooms.includes((track.track?.accessRoom ?? 'standard') as AccessRoomId),
  );
}
