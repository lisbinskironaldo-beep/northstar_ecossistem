import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Audio,
  type AVPlaybackStatus,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';
import type { EchoTrack } from './api';
import { echoApi } from './api';
import {
  buildEchoAssetUrl,
  getTrackPreviewAsset,
  getTrackStreamAsset,
  hasPlayableAudio,
} from './echo-audio';

type PlaybackMode = 'main' | 'preview' | null;

export function useEchoAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const modeRef = useRef<PlaybackMode>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTrackRef = useRef<EchoTrack | null>(null);
  const mainPositionRef = useRef(0);
  const mainDurationRef = useRef(0);

  const [playerTrack, setPlayerTrack] = useState<EchoTrack | null>(null);
  const [playerPlaying, setPlayerPlaying] = useState(false);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [queue, setQueue] = useState<EchoTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  const clearPreviewTimer = useCallback(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  }, []);

  const unloadCurrentSound = useCallback(async () => {
    clearPreviewTimer();
    const current = soundRef.current;

    if (current) {
      try {
        await current.unloadAsync();
      } catch {}
    }

    soundRef.current = null;
    modeRef.current = null;
  }, [clearPreviewTimer]);

  const recordPlayback = useCallback(
    async (track: EchoTrack | null, listenedMs: number, durationMs: number, sourceContext: string) => {
      if (!track || listenedMs <= 0) {
        return;
      }

      try {
        await echoApi.recordPlayback(track.id, {
          userId: echoApi.demoUserId,
          listenedMs,
          completionRatio: durationMs > 0 ? Math.min(1, listenedMs / durationMs) : 0,
          replayCountInSession: 0,
          sourceContext,
        });
      } catch {}
    },
    [],
  );

  const captureMainProgress = useCallback(async () => {
    if (!soundRef.current || modeRef.current !== 'main' || !currentTrackRef.current) {
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        mainPositionRef.current = status.positionMillis;
        mainDurationRef.current = status.durationMillis ?? mainDurationRef.current;
        if (status.positionMillis > 0) {
          await recordPlayback(
            currentTrackRef.current,
            status.positionMillis,
            status.durationMillis ?? mainDurationRef.current,
            'echo-mobile-player-dock',
          );
        }
      }
    } catch {}
  }, [recordPlayback]);

  const configureAudio = useCallback(async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const attachMainSound = useCallback(
    async (track: EchoTrack, startPositionMs = 0) => {
      const asset = getTrackStreamAsset(track);
      if (!asset || asset.transcodedState !== 'ready') {
        throw new Error('Essa faixa ainda nao tem audio real pronto no Echo.');
      }

      await unloadCurrentSound();
      await configureAudio();

      const sound = new Audio.Sound();
      soundRef.current = sound;
      modeRef.current = 'main';
      currentTrackRef.current = track;
      mainPositionRef.current = startPositionMs;
      mainDurationRef.current = asset.durationMs ?? 0;

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded || modeRef.current !== 'main') {
          return;
        }

        mainPositionRef.current = status.positionMillis;
        mainDurationRef.current = status.durationMillis ?? mainDurationRef.current;
        setPlayerPlaying(status.isPlaying);

        if (status.didJustFinish) {
          void recordPlayback(
            track,
            status.positionMillis,
            status.durationMillis ?? mainDurationRef.current,
            'echo-mobile-player-dock',
          );
          setPlayerPlaying(false);
          mainPositionRef.current = 0;
        }
      });

      await sound.loadAsync(
        { uri: buildEchoAssetUrl(asset) },
        {
          shouldPlay: true,
          positionMillis: startPositionMs,
          progressUpdateIntervalMillis: 500,
        },
      );

      setPlayerTrack(track);
      setPlayerPlaying(true);
    },
    [configureAudio, recordPlayback, unloadCurrentSound],
  );

  const selectTrack = useCallback(
    async (track: EchoTrack) => {
      setQueue((current) => {
        const existingIndex = current.findIndex((entry) => entry.id === track.id);
        if (existingIndex >= 0) {
          setQueueIndex(existingIndex);
          return current;
        }

        const nextQueue = [...current, track].slice(-12);
        setQueueIndex(nextQueue.length - 1);
        return nextQueue;
      });

      if (!hasPlayableAudio(track)) {
        setPlayerTrack(track);
        setPlayerPlaying(false);
        currentTrackRef.current = track;
        mainPositionRef.current = 0;
        return 'Essa faixa ainda nao tem audio pronto.';
      }

      await attachMainSound(track, 0);
      return `Tocando ${track.title}.`;
    },
    [attachMainSound],
  );

  const goToQueuedTrack = useCallback(
    async (direction: 'previous' | 'next') => {
      if (queue.length === 0 || queueIndex < 0) {
        return 'Ainda sem fila principal.';
      }

      const targetIndex = direction === 'previous' ? queueIndex - 1 : queueIndex + 1;
      const targetTrack = queue[targetIndex];

      if (!targetTrack) {
        return direction === 'previous' ? 'Nao existe faixa anterior.' : 'Nao existe proxima faixa.';
      }

      setQueueIndex(targetIndex);
      return selectTrack(targetTrack);
    },
    [queue, queueIndex, selectTrack],
  );

  const toggleMainPlayback = useCallback(async () => {
    if (!playerTrack) {
      return 'Escolha uma faixa primeiro.';
    }

    if (!hasPlayableAudio(playerTrack)) {
      return 'Essa faixa ainda nao tem audio pronto.';
    }

    if (soundRef.current && modeRef.current === 'main') {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setPlayerPlaying(false);
          await recordPlayback(
            playerTrack,
            status.positionMillis,
            status.durationMillis ?? mainDurationRef.current,
            'echo-mobile-player-dock',
          );
          return 'Pausado.';
        }

        await soundRef.current.playAsync();
        setPlayerPlaying(true);
        return `Retomando ${playerTrack.title}.`;
      }
    }

    await attachMainSound(playerTrack, mainPositionRef.current);
    return `Tocando ${playerTrack.title}.`;
  }, [attachMainSound, playerTrack, recordPlayback]);

  const pauseMainPlayback = useCallback(async () => {
    if (!soundRef.current || modeRef.current !== 'main' || !playerTrack) {
      setPlayerPlaying(false);
      return;
    }

    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.current.pauseAsync();
      setPlayerPlaying(false);
      await recordPlayback(
        playerTrack,
        status.positionMillis,
        status.durationMillis ?? mainDurationRef.current,
        'echo-mobile-player-dock',
      );
    }
  }, [playerTrack, recordPlayback]);

  const playPreview = useCallback(
    async (track: EchoTrack) => {
      const asset = getTrackPreviewAsset(track) ?? getTrackStreamAsset(track);
      if (!asset || asset.transcodedState !== 'ready') {
        return 'Preview indisponivel: essa faixa ainda nao tem audio pronto.';
      }

      if (soundRef.current && modeRef.current === 'main') {
        await pauseMainPlayback();
      }

      await unloadCurrentSound();
      await configureAudio();

      const sound = new Audio.Sound();
      soundRef.current = sound;
      modeRef.current = 'preview';
      setPreviewTrackId(track.id);
      setPlayerPlaying(false);

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded || modeRef.current !== 'preview') {
          return;
        }

        if (status.didJustFinish) {
          setPreviewTrackId(null);
        }
      });

      await sound.loadAsync(
        { uri: buildEchoAssetUrl(asset) },
        {
          shouldPlay: true,
          positionMillis: 0,
          progressUpdateIntervalMillis: 500,
        },
      );

      clearPreviewTimer();
      previewTimerRef.current = setTimeout(async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.positionMillis > 0) {
            await recordPlayback(
              track,
              status.positionMillis,
              status.durationMillis ?? asset.durationMs ?? 20000,
              'echo-mobile-feed-preview',
            );
          }
        } catch {}

        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch {}

        if (soundRef.current === sound) {
          soundRef.current = null;
        }
        modeRef.current = null;
        setPreviewTrackId(null);
      }, 20000);

      return `Preview de 20s iniciado para ${track.title}.`;
    },
    [clearPreviewTimer, configureAudio, pauseMainPlayback, recordPlayback, unloadCurrentSound],
  );

  useEffect(() => {
    return () => {
      void captureMainProgress();
      void unloadCurrentSound();
    };
  }, [captureMainProgress, unloadCurrentSound]);

  return {
    playerTrack,
    playerPlaying,
    previewTrackId,
    hasPreviousTrack: queueIndex > 0,
    hasNextTrack: queueIndex >= 0 && queueIndex < queue.length - 1,
    selectTrack,
    toggleMainPlayback,
    pauseMainPlayback,
    playPreview,
    playPreviousTrack: () => goToQueuedTrack('previous'),
    playNextTrack: () => goToQueuedTrack('next'),
  };
}
