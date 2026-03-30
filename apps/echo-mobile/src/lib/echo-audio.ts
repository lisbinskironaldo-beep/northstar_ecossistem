import type { EchoContentAsset, EchoTrack } from './api';
import { echoApi } from './api';

function isAudioAsset(asset: EchoContentAsset) {
  return asset.mimeType.startsWith('audio/');
}

function getAudioAssetByRole(track: EchoTrack, role: 'audio_stream' | 'audio_preview') {
  const assets = track.assets?.filter(isAudioAsset) ?? [];

  return (
    assets.find((asset) => asset.assetRole === role) ??
    assets.find((asset) => asset.assetRole === 'audio_stream') ??
    assets.find((asset) => asset.assetRole === 'audio_preview') ??
    assets[0] ??
    null
  );
}

export function getTrackStreamAsset(track: EchoTrack) {
  return getAudioAssetByRole(track, 'audio_stream');
}

export function getTrackPreviewAsset(track: EchoTrack) {
  return getAudioAssetByRole(track, 'audio_preview');
}

export function getTrackAudioAsset(
  track: EchoTrack,
  role: 'audio_stream' | 'audio_preview' = 'audio_stream',
) {
  return role === 'audio_preview' ? getTrackPreviewAsset(track) : getTrackStreamAsset(track);
}

export function buildEchoAssetUrl(asset: EchoContentAsset) {
  if (/^https?:\/\//i.test(asset.publicPath)) {
    return asset.publicPath;
  }

  return `${echoApi.baseUrl}${asset.publicPath}`;
}

export function hasPlayableAudio(track: EchoTrack) {
  const asset = getTrackStreamAsset(track) ?? getTrackPreviewAsset(track);
  return Boolean(asset && asset.transcodedState === 'ready');
}

export function describeTrackAudioSource(track: EchoTrack) {
  const streamAsset = getTrackStreamAsset(track);
  const previewAsset = getTrackPreviewAsset(track);

  if (!streamAsset && !previewAsset) {
    return {
      streamReady: false,
      previewReady: false,
      sourceLabel: 'sem audio pronto',
    };
  }

  const baseAsset = streamAsset ?? previewAsset;
  const provider = baseAsset?.storageProvider ?? 'unknown';

  let sourceLabel = 'asset pronto';
  if (provider === 'local_static') {
    sourceLabel = 'sample local';
  } else if (provider === 'remote_url') {
    sourceLabel = 'asset remoto';
  } else if (provider === 'cloudflare_r2' || provider === 'cloudflare_r2_public') {
    sourceLabel = 'storage cloud';
  }

  return {
    streamReady: Boolean(streamAsset && streamAsset.transcodedState === 'ready'),
    previewReady: Boolean(previewAsset && previewAsset.transcodedState === 'ready'),
    sourceLabel,
  };
}
