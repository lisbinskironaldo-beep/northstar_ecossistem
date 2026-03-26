import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { EchoTrack, ReportReason, echoApi } from '../src/lib/api';
import { DemoSetupCard } from '../src/components/demo-setup-card';

const REPORT_REASON_OPTIONS: Array<{ label: string; reason: ReportReason }> = [
  { label: 'Nao e IA', reason: 'not_ai_content' },
  { label: 'Spam', reason: 'duplicate_or_spam' },
  { label: 'Direitos', reason: 'rights_or_ownership_issue' },
];

export default function HomeScreen() {
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackByTrack, setFeedbackByTrack] = useState<Record<string, string>>({});
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [reportComposerTrackId, setReportComposerTrackId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTracks() {
      try {
        const data = await echoApi.getTracks();

        if (active) {
          setTracks(data);
          setSelectedTrackId((current) => current ?? data[0]?.id ?? null);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load tracks');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      active = false;
    };
  }, []);

  async function handleSave(contentId: string) {
    try {
      const result = await echoApi.saveTrack(contentId);
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]: result.alreadySaved ? 'Faixa ja salva' : 'Faixa salva no shell',
      }));
    } catch (saveError) {
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]:
          saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar a faixa',
      }));
    }
  }

  async function handlePlayback(contentId: string) {
    return handlePlaybackPreset(contentId, 20000, 0.66, 'Playback de teste registrado');
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
        sourceContext: 'echo-shell-player',
      });

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

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) ?? null;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Loading Echo feed...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Echo Feed</Text>
      <DemoSetupCard
        apiBaseUrl={echoApi.baseUrl}
        demoUserId={echoApi.demoUserId}
        demoCreatorId={echoApi.demoCreatorId}
      />
      {error ? (
        <Text style={{ color: '#b91c1c' }}>
          Unable to reach the API yet. {error}
        </Text>
      ) : null}
      {selectedTrack ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderRadius: 20,
            padding: 18,
            gap: 10,
            backgroundColor: '#0f172a',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#f8fafc' }}>Echo Player</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#f8fafc' }}>
            {selectedTrack.title}
          </Text>
          <Text style={{ color: '#cbd5e1' }}>
            {selectedTrack.track?.artistNameDisplay ?? 'Unknown artist'} / @{selectedTrack.creator.handle}
          </Text>
          <Text style={{ color: '#94a3b8' }}>
            Player minimo do MVP: abre a faixa ativa e registra uma sessao real de escuta no backend.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            <Pressable
              onPress={() =>
                handlePlaybackPreset(selectedTrack.id, 15000, 0.33, 'Sessao curta registrada')
              }
              style={secondaryButtonStyle}
            >
              <Text style={buttonTextStyle}>Ouvir 15s</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                handlePlaybackPreset(selectedTrack.id, 30000, 0.66, 'Sessao media registrada')
              }
              style={secondaryButtonStyle}
            >
              <Text style={buttonTextStyle}>Ouvir 30s</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                handlePlaybackPreset(selectedTrack.id, 45000, 1, 'Faixa concluida no player')
              }
              style={buttonStyle}
            >
              <Text style={buttonTextStyle}>Ouvir ate o fim</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={() => handleSave(selectedTrack.id)} style={buttonStyle}>
              <Text style={buttonTextStyle}>Salvar no player</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                setReportComposerTrackId((current) =>
                  current === selectedTrack.id ? null : selectedTrack.id,
                )
              }
              style={dangerButtonStyle}
            >
              <Text style={buttonTextStyle}>Reportar</Text>
            </Pressable>
          </View>
          {reportComposerTrackId === selectedTrack.id ? (
            <View style={{ gap: 8, marginTop: 4 }}>
              <Text style={{ color: '#e2e8f0', fontWeight: '600' }}>Motivo do report</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {REPORT_REASON_OPTIONS.map((option) => (
                  <Pressable
                    key={`${selectedTrack.id}-${option.reason}`}
                    onPress={() => handleReport(selectedTrack.id, option.reason)}
                    style={reportChipStyle}
                  >
                    <Text style={buttonTextStyle}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          {feedbackByTrack[selectedTrack.id] ? (
            <Text style={{ color: '#86efac' }}>{feedbackByTrack[selectedTrack.id]}</Text>
          ) : null}
        </View>
      ) : null}
      {tracks.length === 0 ? (
        <Text style={{ color: '#52525b' }}>No tracks available yet.</Text>
      ) : null}
      {tracks.map((track) => (
        <View
          key={track.id}
          style={{
            borderWidth: 1,
            borderColor: '#e4e4e7',
            borderRadius: 16,
            padding: 16,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600' }}>{track.title}</Text>
          <Text>{track.track?.artistNameDisplay ?? 'Unknown artist'}</Text>
          <Text style={{ color: '#52525b' }}>Creator: @{track.creator.handle}</Text>
          <Text style={{ color: '#52525b' }}>
            State: {track.contentState} / Reach: {track.visibilityState}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Pressable
              onPress={() => setSelectedTrackId(track.id)}
              style={selectedTrackId === track.id ? buttonStyle : secondaryButtonStyle}
            >
              <Text style={buttonTextStyle}>Abrir player</Text>
            </Pressable>
            <Pressable onPress={() => handleSave(track.id)} style={buttonStyle}>
              <Text style={buttonTextStyle}>Salvar</Text>
            </Pressable>
            <Pressable onPress={() => handlePlayback(track.id)} style={secondaryButtonStyle}>
              <Text style={buttonTextStyle}>Registrar play</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                setReportComposerTrackId((current) => (current === track.id ? null : track.id))
              }
              style={dangerButtonStyle}
            >
              <Text style={buttonTextStyle}>Reportar</Text>
            </Pressable>
          </View>
          {reportComposerTrackId === track.id ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {REPORT_REASON_OPTIONS.map((option) => (
                <Pressable
                  key={`${track.id}-${option.reason}`}
                  onPress={() => handleReport(track.id, option.reason)}
                  style={reportChipStyle}
                >
                  <Text style={buttonTextStyle}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          {feedbackByTrack[track.id] ? (
            <Text style={{ color: '#0f766e', marginTop: 8 }}>{feedbackByTrack[track.id]}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const buttonStyle = {
  backgroundColor: '#111827',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const secondaryButtonStyle = {
  backgroundColor: '#334155',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const dangerButtonStyle = {
  backgroundColor: '#7f1d1d',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const reportChipStyle = {
  backgroundColor: '#1e293b',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const buttonTextStyle = {
  color: '#f8fafc',
  fontWeight: '600' as const,
};
