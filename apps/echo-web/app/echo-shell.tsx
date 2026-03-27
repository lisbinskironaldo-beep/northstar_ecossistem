'use client';

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { DemoSetupCard } from './components/demo-setup-card';
import {
  ActionButton,
  Card,
  Chip,
  Field,
  Grid,
  MetricCard,
  Notice,
  PageShell,
  Pill,
  Stack,
  TabButton,
  helperTextStyle,
  inputStyle,
  textAreaStyle,
} from './components/ui';
import {
  EchoCategory,
  EchoCreator,
  EchoTrack,
  FollowedCreatorEntry,
  ReportReason,
  SavedTrackEntry,
  echoApi,
} from './lib/api';

type TabId = 'feed' | 'explore' | 'upload' | 'creators';
type ViewerMode = 'listener' | 'creator';

const tabs: Array<{ id: TabId; label: string; audience: ViewerMode }> = [
  { id: 'feed', label: 'Feed', audience: 'listener' },
  { id: 'explore', label: 'Explore', audience: 'listener' },
  { id: 'creators', label: 'Artists', audience: 'listener' },
  { id: 'upload', label: 'Creator area', audience: 'creator' },
];

const TAB_COPY: Record<TabId, { eyebrow: string; title: string; subtitle: string }> = {
  feed: {
    eyebrow: 'Listener loop',
    title: 'Feed + player',
    subtitle: 'Descoberta, escuta, save e report num fluxo unico.',
  },
  explore: {
    eyebrow: 'Catalog',
    title: 'Explore o acervo',
    subtitle: 'Faixas salvas e categorias que ajudam a ler a qualidade do catalogo.',
  },
  creators: {
    eyebrow: 'Artist radar',
    title: 'Artists',
    subtitle: 'Quem o publico pode seguir e quem ja esta ganhando forma dentro do Echo.',
  },
  upload: {
    eyebrow: 'Creator access',
    title: 'Area do creator',
    subtitle: 'Entrada profissional para criar perfil, publicar e organizar o proprio ponto de partida.',
  },
};

const REPORT_REASON_OPTIONS: Array<{ label: string; reason: ReportReason }> = [
  { label: 'Nao e IA', reason: 'not_ai_content' },
  { label: 'Spam', reason: 'duplicate_or_spam' },
  { label: 'Direitos', reason: 'rights_or_ownership_issue' },
];

function getCreatorTierTone(tier: string): 'default' | 'accent' | 'success' | 'warning' {
  if (tier.toLowerCase().includes('elite') || tier.toLowerCase().includes('prime')) {
    return 'success';
  }

  if (tier.toLowerCase().includes('rising') || tier.toLowerCase().includes('viral')) {
    return 'accent';
  }

  return 'warning';
}

function buildArtworkStyle(seed: string): CSSProperties {
  const palette = [
    ['#0f172a', '#2563eb'],
    ['#111827', '#0891b2'],
    ['#172554', '#7c3aed'],
    ['#1f2937', '#ea580c'],
    ['#0b1120', '#14b8a6'],
  ];
  const index = seed
    .split('')
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0) % palette.length;
  const [from, to] = palette[index];

  return {
    width: 140,
    minWidth: 140,
    aspectRatio: '1 / 1',
    borderRadius: 26,
    background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 30%), linear-gradient(145deg, ${from}, ${to})`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
    position: 'relative',
    overflow: 'hidden',
  };
}

export function EchoShell() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>('listener');
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [showSetupDetails, setShowSetupDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [categories, setCategories] = useState<EchoCategory[]>([]);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [savedTracks, setSavedTracks] = useState<SavedTrackEntry[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [reportComposerTrackId, setReportComposerTrackId] = useState<string | null>(null);
  const [feedbackByTrack, setFeedbackByTrack] = useState<Record<string, string>>({});
  const [feedbackByCreator, setFeedbackByCreator] = useState<Record<string, string>>({});

  const [creatorId, setCreatorId] = useState(echoApi.demoCreatorId ?? '');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupHandle, setSetupHandle] = useState('');
  const [setupBio, setSetupBio] = useState('');
  const [setupResultMessage, setSetupResultMessage] = useState<string | null>(null);
  const [creatingCreator, setCreatingCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [artistNameDisplay, setArtistNameDisplay] = useState('');
  const [description, setDescription] = useState('');
  const [sourceToolOptional, setSourceToolOptional] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [aiDeclaration, setAiDeclaration] = useState(true);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAll() {
      try {
        const [trackData, categoryData, creatorData, savedData, followedData] = await Promise.all([
          echoApi.getTracks(),
          echoApi.getCategories(),
          echoApi.getCreators(),
          echoApi.getSavedTracks().catch(() => []),
          echoApi.getFollowedCreators().catch(() => []),
        ]);

        if (!active) {
          return;
        }

        setTracks(trackData);
        setCategories(categoryData);
        setCreators(creatorData);
        setSavedTracks(savedData);
        setFollowedCreators(followedData);
        setSelectedTrackId((current) => current ?? trackData[0]?.id ?? null);

        const resolvedCreator =
          creatorData.find((creator) => creator.id === echoApi.demoCreatorId) ?? creatorData[0];

        if (resolvedCreator) {
          setCreatorId((current) => current || resolvedCreator.id);
          setArtistNameDisplay((current) =>
            current || resolvedCreator.displayName || resolvedCreator.handle,
          );
          setSetupDisplayName((current) => current || resolvedCreator.displayName);
          setSetupHandle((current) => current || resolvedCreator.handle);
          setSetupBio((current) => current || resolvedCreator.bio || '');
        }

        if (categoryData[0]) {
          setPrimaryCategoryId((current) => current || categoryData[0].id);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load Echo data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      active = false;
    };
  }, []);

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) ?? null,
    [selectedTrackId, tracks],
  );
  const visibleTabs = tabs.filter((tab) => tab.audience === viewerMode);
  const tabCopy = TAB_COPY[activeTab];
  const listenerFeedTracks = useMemo(
    () =>
      tracks.filter(
        (track) => track.contentState === 'published' && track.visibilityState === 'visible',
      ),
    [tracks],
  );
  const reserveTracks = useMemo(
    () =>
      tracks.filter(
        (track) => track.contentState === 'published' && track.visibilityState !== 'visible',
      ),
    [tracks],
  );
  const artistsToWatch = useMemo(
    () => creators.slice().sort((left, right) => right.followerCountCached - left.followerCountCached).slice(0, 3),
    [creators],
  );
  const followedCreatorIds = useMemo(
    () => new Set(followedCreators.map((entry) => entry.creator.id)),
    [followedCreators],
  );
  const risingCreators = useMemo(
    () =>
      creators
        .slice()
        .sort(
          (left, right) =>
            right.followerCountCached +
            right.publishedContentCountCached * 3 -
            (left.followerCountCached + left.publishedContentCountCached * 3),
        )
        .slice(0, 4),
    [creators],
  );
  const firstBetCreators = useMemo(
    () =>
      creators
        .filter((creator) => !followedCreatorIds.has(creator.id))
        .slice()
        .sort((left, right) => right.publishedContentCountCached - left.publishedContentCountCached)
        .slice(0, 3),
    [creators, followedCreatorIds],
  );

  const summaryStats = [
    { label: 'Faixas ativas', value: tracks.length, note: 'Catalogo visivel no feed.' },
    { label: 'Saves demo', value: savedTracks.length, note: 'Sinal de repeticao e valor percebido.' },
    {
      label: 'Criadores',
      value: creators.length,
      note: 'Base atual pronta para crescer com onboarding real.',
    },
    {
      label: 'Seguidos',
      value: followedCreators.length,
      note: 'Relacao ativa entre audiencia e creator.',
    },
  ];
  const listenerHighlights = [
    {
      label: 'Primeiro impacto',
      value: tracks[0]?.title ?? 'Sem faixa de abertura',
      note: 'A primeira musica precisa dizer rapido por que Echo existe.',
    },
    {
      label: 'Faixas para salvar',
      value: Math.min(Math.max(savedTracks.length + 3, 4), tracks.length || 4),
      note: 'Estimativa inicial de faixas que ja parecem fortes o suficiente para retention.',
    },
    {
      label: 'Artistas em radar',
      value: followedCreators.length || Math.min(creators.length, 6),
      note: 'Sinal de quantos nomes ja podem virar habito ou curiosidade.',
    },
  ];

  async function refreshSavedAndFollowed() {
    const [savedData, followedData] = await Promise.all([
      echoApi.getSavedTracks().catch(() => []),
      echoApi.getFollowedCreators().catch(() => []),
    ]);

    setSavedTracks(savedData);
    setFollowedCreators(followedData);
  }

  async function handleSave(contentId: string) {
    try {
      const result = await echoApi.saveTrack(contentId);
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]: result.alreadySaved ? 'Faixa ja salva' : 'Faixa salva no preview web',
      }));
      await refreshSavedAndFollowed();
    } catch (saveError) {
      setFeedbackByTrack((current) => ({
        ...current,
        [contentId]:
          saveError instanceof Error ? saveError.message : 'Nao foi possivel salvar a faixa',
      }));
    }
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
        sourceContext: 'echo-web-player',
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

  async function handleFollow(creatorIdToFollow: string) {
    try {
      const result = await echoApi.followCreator(creatorIdToFollow);
      setFeedbackByCreator((current) => ({
        ...current,
        [creatorIdToFollow]: result.alreadyFollowing
          ? 'Creator ja seguido no preview web'
          : 'Follow registrado no preview web',
      }));
      await refreshSavedAndFollowed();
    } catch (followError) {
      setFeedbackByCreator((current) => ({
        ...current,
        [creatorIdToFollow]:
          followError instanceof Error
            ? followError.message
            : 'Nao foi possivel seguir o creator',
      }));
    }
  }

  async function handleCreatorSetup() {
    if (!setupEmail.trim() || !setupDisplayName.trim() || !setupHandle.trim()) {
      setSetupResultMessage('Email, display name and handle are required to create a creator.');
      return;
    }

    setCreatingCreator(true);
    setSetupResultMessage('Creating account and creator profile...');

    try {
      const user = await echoApi.registerUser({
        email: setupEmail.trim(),
        country: 'BR',
        preferredLanguage: 'pt-BR',
      });

      const creator = await echoApi.createCreatorProfile({
        userId: user.id,
        displayName: setupDisplayName.trim(),
        handle: setupHandle.trim().replace(/^@+/, ''),
        bio: setupBio.trim() || undefined,
        primaryFront: 'echo',
      });

      const updatedCreators = await echoApi.getCreators();

      setCreators(updatedCreators);
      setCreatorId(creator.id);
      setArtistNameDisplay((current) => current || creator.displayName);
      setSetupResultMessage(`Creator ready: ${creator.displayName} (@${creator.handle})`);
      setSetupEmail('');
      setSetupBio('');
    } catch (setupError) {
      setSetupResultMessage(
        setupError instanceof Error ? setupError.message : 'Unable to create creator profile',
      );
    } finally {
      setCreatingCreator(false);
    }
  }

  async function handleSubmitTrack() {
    if (!creatorId || !title.trim() || !artistNameDisplay.trim()) {
      setUploadMessage('Creator, title and artist name are required.');
      return;
    }

    setSubmitting(true);
    setUploadMessage('Submitting...');

    try {
      const track = await echoApi.createTrack({
        creatorId,
        title: title.trim(),
        description: description.trim() || undefined,
        primaryCategoryId: primaryCategoryId || undefined,
        artistNameDisplay: artistNameDisplay.trim(),
        aiDeclaration,
        sourceToolOptional: sourceToolOptional.trim() || undefined,
      });

      setTracks((current) => [track, ...current]);
      setSelectedTrackId(track.id);
      setTitle('');
      setDescription('');
      setSourceToolOptional('');
      setUploadMessage(`Track created: ${track.title}`);
    } catch (submitError) {
      setUploadMessage(
        submitError instanceof Error ? `Upload failed: ${submitError.message}` : 'Upload failed',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Echo"
      description="Primeira frente publica do Northstar Ecosystem. O Echo e o app publico de musica IA: ouvintes entram para descobrir e salvar; creators entram para publicar e construir presenca; gestao fica fora daqui."
    >
      <Stack gap={20}>
        <Grid min={260}>
          <Card
            title="A musica IA em primeiro plano"
            subtitle="Echo comeca como um palco de descoberta, nao como uma ferramenta de criacao."
            accent="#1d4ed8"
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Pill label="Echo / Music IA" tone="accent" />
                <Pill label="Preview de navegador" tone="success" />
                <Pill label="API local conectada" tone={error ? 'warning' : 'success'} />
              </div>
              <p style={helperTextStyle}>
                Aqui a gente valida o produto publico antes do acabamento final: uma experiencia
                para ouvir, uma entrada separada para creators e a gestao fora do app.
              </p>
            </Stack>
          </Card>

          <Card title={tabCopy.title} subtitle={tabCopy.eyebrow} accent="rgba(59, 130, 246, 0.5)">
            <p style={helperTextStyle}>{tabCopy.subtitle}</p>
          </Card>
        </Grid>

        <Grid min={180}>
          {summaryStats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
          ))}
        </Grid>

        {viewerMode === 'listener' ? (
          <Grid min={220}>
            {listenerHighlights.map((stat) => (
              <MetricCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
            ))}
          </Grid>
        ) : null}

        <Grid min={260}>
          <Card
            title="Quem esta entrando agora?"
            subtitle="O Echo e um app publico, mas com dois caminhos bem diferentes."
            accent="rgba(59, 130, 246, 0.35)"
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <ActionButton
                  label="Entrar como ouvinte"
                  tone={viewerMode === 'listener' ? 'default' : 'secondary'}
                  onClick={() => {
                    setViewerMode('listener');
                    setActiveTab('feed');
                  }}
                />
                <ActionButton
                  label="Entrar como creator"
                  tone={viewerMode === 'creator' ? 'default' : 'secondary'}
                  onClick={() => {
                    setViewerMode('creator');
                    setActiveTab('upload');
                  }}
                />
              </div>
              <p style={helperTextStyle}>
                Ouvintes entram para descobrir musica e seguir artistas. Creators entram para criar
                perfil e subir faixas. A gestao usa Admin e Command Center fora do Echo.
              </p>
            </Stack>
          </Card>

          <Card
            title={viewerMode === 'listener' ? 'Modo ouvinte' : 'Modo creator'}
            subtitle={viewerMode === 'listener' ? 'Experiencia publica principal' : 'Entrada profissional no app'}
            accent={viewerMode === 'listener' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(249, 115, 22, 0.35)'}
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label={viewerMode === 'listener' ? 'Publico geral' : 'Creator access'} tone="accent" />
                <Pill label="Gestao fora do app" tone="default" />
              </div>
              <p style={helperTextStyle}>
                {viewerMode === 'listener'
                  ? 'Aqui a prioridade e ouvir rapido, explorar, salvar e acompanhar artistas.'
                  : 'Aqui a prioridade e ativar identidade, publicar e acompanhar o proprio ponto de partida.'}
              </p>
            </Stack>
          </Card>

          <Card
            title="Gestao"
            subtitle="Nao faz parte da experiencia publica do Echo."
            accent="rgba(148, 163, 184, 0.28)"
          >
            <p style={helperTextStyle}>
              Reports, moderacao, riscos, operacao e leitura de saude do sistema vivem no Admin
              Web e no Command Center. O app publico nao deve carregar funcao de gestor.
            </p>
          </Card>
        </Grid>

        {selectedTrack ? (
          <Card
            title="Spotlight"
            subtitle="Faixa em destaque agora, com clima mais de vitrine do produto."
            accent="rgba(37, 99, 235, 0.4)"
          >
            <div
              style={{
                display: 'grid',
                gap: 22,
                gridTemplateColumns: 'minmax(180px, 220px) 1fr',
                alignItems: 'center',
              }}
            >
              <div style={{ ...buildArtworkStyle(selectedTrack.id), width: '100%', minWidth: 180 }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.18) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 18,
                    left: 18,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <Pill label="Spotlight" tone="accent" />
                  <Pill label={selectedTrack.visibilityState} tone="default" />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <Pill
                    label={selectedTrack.track?.aiDeclaration ? 'IA declarada' : 'Sem declaracao'}
                    tone={selectedTrack.track?.aiDeclaration ? 'success' : 'warning'}
                  />
                  <Pill label={selectedTrack.contentState} tone="accent" />
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.1 }}>
                  {selectedTrack.title}
                </div>
                <div style={{ marginTop: 8, color: '#dbe7ff', fontSize: 18 }}>
                  {selectedTrack.track?.artistNameDisplay ?? 'Unknown artist'}
                </div>
                <div style={{ marginTop: 6, color: '#8da3ca' }}>
                  publicado por @{selectedTrack.creator.handle}
                </div>
                <p style={{ ...helperTextStyle, marginTop: 16 }}>
                  A vitrine do Echo precisa convencer rapido: faixa, artista, contexto e acoes
                  claras, tudo sem parecer dashboard.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        {viewerMode === 'creator' ? (
          <Card
            title="Console local"
            subtitle="Status rapido do ambiente de desenvolvimento e do modo demo."
          >
            <Stack gap={14}>
              <Notice title="Modo local" tone={echoApi.demoUserId ? 'success' : 'warning'}>
                <div>
                  API: <strong>{echoApi.baseUrl}</strong>
                </div>
                <div>
                  Demo user: <strong>{echoApi.demoUserId ?? 'nao configurado'}</strong>
                </div>
                <div>
                  Demo creator: <strong>{echoApi.demoCreatorId ?? 'nao configurado'}</strong>
                </div>
              </Notice>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <ActionButton
                  label={showSetupDetails ? 'Ocultar detalhes tecnicos' : 'Mostrar detalhes tecnicos'}
                  tone="secondary"
                  onClick={() => setShowSetupDetails((current) => !current)}
                />
              </div>
              {showSetupDetails ? (
                <DemoSetupCard
                  apiBaseUrl={echoApi.baseUrl}
                  demoUserId={echoApi.demoUserId}
                  demoCreatorId={echoApi.demoCreatorId}
                  showCreator={activeTab === 'upload'}
                />
              ) : null}
            </Stack>
          </Card>
        ) : null}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {visibleTabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              label={tab.label}
              description={TAB_COPY[tab.id].eyebrow}
            />
          ))}
        </div>

        {loading ? (
          <Card title="Loading Echo" subtitle="Fetching live local data from the API.">
            <p style={helperTextStyle}>The preview is pulling tracks, categories and creators now.</p>
          </Card>
        ) : null}

        {error ? (
          <Notice title="Falha de leitura de dados" tone="danger">
            {error}
          </Notice>
        ) : null}
        {!loading && activeTab === 'feed' ? (
          <Stack gap={18}>
            <Grid min={250}>
              <Card
                title="Ouvir agora"
                subtitle="Abertura da sessao para prender atencao rapido."
                accent="rgba(16, 185, 129, 0.28)"
              >
                <Stack gap={10}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Pill label="Abertura do feed" tone="success" />
                    <Pill label={`${listenerFeedTracks.length} visiveis`} tone="accent" />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>
                    {listenerFeedTracks[0]?.title ?? 'Sem faixa de abertura'}
                  </div>
                  <div style={{ color: '#c6d4ee' }}>
                    {listenerFeedTracks[0]?.track?.artistNameDisplay ?? 'Catalogo ainda aquecendo'}
                  </div>
                  <p style={helperTextStyle}>
                    O Echo precisa fazer o usuario sentir em segundos que aqui existe musica nova
                    que vale uma escuta completa.
                  </p>
                </Stack>
              </Card>

              <Card
                title="Boas para save"
                subtitle="Faixas que ja ajudam a construir habito."
                accent="rgba(37, 99, 235, 0.28)"
              >
                <Stack gap={10}>
                  {(savedTracks.length ? savedTracks.map((entry) => entry.content) : listenerFeedTracks.slice(0, 2)).slice(0, 2).map((track) => (
                    <div key={track.id} style={{ display: 'grid', gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>{track.title}</div>
                      <div style={{ color: '#8da3ca' }}>
                        {track.track?.artistNameDisplay ?? 'Unknown artist'} / @{track.creator.handle}
                      </div>
                    </div>
                  ))}
                  <p style={helperTextStyle}>
                    Aqui fica o sinal de que o Echo nao e so curiosidade. Ele precisa ter coisas
                    para guardar e voltar depois.
                  </p>
                </Stack>
              </Card>

              <Card
                title="Artistas para acompanhar"
                subtitle="Nomes que ja comecam a parecer promissores."
                accent="rgba(168, 85, 247, 0.24)"
              >
                <Stack gap={10}>
                  {artistsToWatch.map((creator) => (
                    <div key={creator.id} style={{ display: 'grid', gap: 4 }}>
                      <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                      <div style={{ color: '#8da3ca' }}>
                        @{creator.handle} / {creator.publishedContentCountCached} faixas
                      </div>
                    </div>
                  ))}
                  <p style={helperTextStyle}>
                    O follow aqui precisa parecer descoberta antecipada, nao so uma acao tecnica.
                  </p>
                </Stack>
              </Card>
            </Grid>

            <Grid min={360}>
            <Card
              title="Em reproducao"
              subtitle="Faixa atual com contexto claro e acoes centrais do ouvinte."
              accent="rgba(59, 130, 246, 0.5)"
            >
              {selectedTrack ? (
                <Stack gap={14}>
                  <div
                    style={{
                      display: 'grid',
                      gap: 18,
                      gridTemplateColumns: 'minmax(140px, 160px) 1fr',
                      alignItems: 'center',
                    }}
                  >
                    <div style={buildArtworkStyle(selectedTrack.id)}>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.22) 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 18,
                          right: 18,
                          bottom: 18,
                          display: 'grid',
                          gap: 6,
                        }}
                      >
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.75)' }} />
                        <div style={{ height: 6, width: '72%', borderRadius: 999, background: 'rgba(255,255,255,0.55)' }} />
                        <div style={{ height: 6, width: '52%', borderRadius: 999, background: 'rgba(255,255,255,0.35)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        <Pill label={selectedTrack.contentState} tone="accent" />
                        <Pill label={selectedTrack.visibilityState} tone="default" />
                        <Pill
                          label={selectedTrack.track?.aiDeclaration ? 'IA declarada' : 'Sem declaracao'}
                          tone={selectedTrack.track?.aiDeclaration ? 'success' : 'warning'}
                        />
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 800 }}>{selectedTrack.title}</div>
                      <div style={{ marginTop: 6, color: '#c6d4ee', fontSize: 16 }}>
                        {selectedTrack.track?.artistNameDisplay ?? 'Unknown artist'}
                      </div>
                      <div style={{ marginTop: 6, color: '#8da3ca' }}>
                        publicado por @{selectedTrack.creator.handle}
                      </div>
                      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {categories.slice(0, 3).map((category) => (
                          <Pill key={category.id} label={category.displayName} tone="default" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={helperTextStyle}>
                    Esta area e o equivalente direto do fluxo principal do app: escolher uma faixa,
                    ouvir, salvar ou reportar, sempre escrevendo no backend real.
                  </p>
                  <div style={{ color: '#8da3ca', fontSize: 13, fontWeight: 700 }}>
                    Escuta
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label="Ouvir 15s"
                      tone="secondary"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 15000, 0.33, 'Sessao curta registrada')
                      }
                    />
                    <ActionButton
                      label="Ouvir 30s"
                      tone="secondary"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 30000, 0.66, 'Sessao media registrada')
                      }
                    />
                    <ActionButton
                      label="Ouvir ate o fim"
                      onClick={() =>
                        handlePlaybackPreset(selectedTrack.id, 45000, 1, 'Faixa concluida no player')
                      }
                    />
                  </div>
                  <div style={{ color: '#8da3ca', fontSize: 13, fontWeight: 700 }}>Acoes rapidas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label="Salvar no player"
                      onClick={() => handleSave(selectedTrack.id)}
                    />
                    <ActionButton
                      label="Reportar"
                      tone="danger"
                      onClick={() =>
                        setReportComposerTrackId((current) =>
                          current === selectedTrack.id ? null : selectedTrack.id,
                        )
                      }
                    />
                  </div>
                  {reportComposerTrackId === selectedTrack.id ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {REPORT_REASON_OPTIONS.map((option) => (
                        <Chip
                          key={`${selectedTrack.id}-${option.reason}`}
                          label={option.label}
                          onClick={() => handleReport(selectedTrack.id, option.reason)}
                        />
                      ))}
                    </div>
                  ) : null}
                  {feedbackByTrack[selectedTrack.id] ? (
                    <Notice title="Ultima acao na faixa" tone="success">
                      {feedbackByTrack[selectedTrack.id]}
                    </Notice>
                  ) : null}
                </Stack>
              ) : (
                <p style={helperTextStyle}>No tracks available yet.</p>
              )}
            </Card>

            <Card title="Descoberta continua" subtitle="Faixas que sustentam a sensacao de novidade e profundidade.">
              <Stack gap={14}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.slice(0, 4).map((category) => (
                    <Pill key={category.id} label={category.displayName} tone="accent" />
                  ))}
                </div>
                <Notice title="Leitura do feed" tone="info">
                  O objetivo desta fila nao e mostrar tudo. E sugerir rapido que aqui existem
                  artistas novos, sons diferentes e algumas faixas que merecem save.
                </Notice>
                {listenerFeedTracks.length === 0 ? <p style={helperTextStyle}>No tracks seeded yet.</p> : null}
                {listenerFeedTracks.map((track, index) => (
                  <div
                    key={track.id}
                    style={{
                      border: '1px solid rgba(59, 130, 246, 0.18)',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(10, 22, 40, 0.7)',
                      outline:
                        selectedTrackId === track.id ? '2px solid rgba(59, 130, 246, 0.55)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ ...buildArtworkStyle(track.id), width: 64, minWidth: 64, borderRadius: 18 }} />
                          <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                              <Pill label={`Faixa ${index + 1}`} tone="default" />
                              {index < 3 ? <Pill label="Top da sessao" tone="accent" /> : null}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>{track.title}</div>
                            <div style={{ marginTop: 4, color: '#d2dcf0' }}>
                              {track.track?.artistNameDisplay ?? 'Unknown artist'}
                            </div>
                            <div style={{ marginTop: 4, color: '#8da3ca' }}>@{track.creator.handle}</div>
                          </div>
                        </div>
                      </div>
                      <Pill
                        label={selectedTrackId === track.id ? 'Selecionada' : 'No feed'}
                        tone={selectedTrackId === track.id ? 'accent' : 'default'}
                      />
                    </div>
                    <div style={{ marginTop: 8, color: '#8da3ca' }}>
                      {track.contentState} / {track.visibilityState}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
                      <ActionButton
                        label="Abrir player"
                        tone={selectedTrackId === track.id ? 'default' : 'secondary'}
                        onClick={() => setSelectedTrackId(track.id)}
                      />
                      <ActionButton label="Salvar" onClick={() => handleSave(track.id)} />
                      <ActionButton
                        label="Registrar play"
                        tone="secondary"
                        onClick={() =>
                          handlePlaybackPreset(track.id, 20000, 0.66, 'Playback de teste registrado')
                        }
                      />
                      <ActionButton
                        label="Reportar"
                        tone="danger"
                        onClick={() =>
                          setReportComposerTrackId((current) =>
                            current === track.id ? null : track.id,
                          )
                        }
                      />
                    </div>
                    {reportComposerTrackId === track.id ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                        {REPORT_REASON_OPTIONS.map((option) => (
                          <Chip
                            key={`${track.id}-${option.reason}`}
                            label={option.label}
                            onClick={() => handleReport(track.id, option.reason)}
                          />
                        ))}
                      </div>
                    ) : null}
                    {feedbackByTrack[track.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>{feedbackByTrack[track.id]}</p>
                    ) : null}
                  </div>
                ))}
                {reserveTracks.length > 0 ? (
                  <Notice title="Reserva do catalogo" tone="warning">
                    Existem {reserveTracks.length} faixas fora da abertura visivel. Elas servem para
                    refresh do feed e para evitar que a primeira sessao fique repetitiva cedo demais.
                  </Notice>
                ) : null}
              </Stack>
            </Card>
            </Grid>
          </Stack>
        ) : null}

        {!loading && viewerMode === 'listener' && activeTab === 'explore' ? (
          <Grid min={360}>
            <Card
              title="Your library"
              subtitle="Colecao pessoal do listener demo. Esse bloco aproxima o Echo de uma experiencia musical recorrente."
            >
              <Stack gap={12}>
                {savedTracks[0] ? (
                  <div
                    style={{
                      display: 'grid',
                      gap: 16,
                      gridTemplateColumns: '96px 1fr',
                      padding: 16,
                      borderRadius: 20,
                      background: 'rgba(10, 22, 40, 0.72)',
                      border: '1px solid rgba(59, 130, 246, 0.24)',
                    }}
                  >
                    <div style={{ ...buildArtworkStyle(savedTracks[0].content.id), width: 96, minWidth: 96, borderRadius: 20 }} />
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        <Pill label="Saved now" tone="success" />
                        <Pill label="Replay candidate" tone="accent" />
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>{savedTracks[0].content.title}</div>
                      <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                        {savedTracks[0].content.track?.artistNameDisplay ?? 'Unknown artist'}
                      </div>
                      <div style={{ marginTop: 4, color: '#8da3ca' }}>
                        @{savedTracks[0].content.creator.handle}
                      </div>
                    </div>
                  </div>
                ) : null}
                {savedTracks.length === 0 ? (
                  <p style={helperTextStyle}>No saved tracks yet for the demo user.</p>
                ) : null}
                {savedTracks.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <Pill label="Salva" tone="success" />
                    </div>
                    <div style={{ fontWeight: 700 }}>{entry.content.title}</div>
                    <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                      {entry.content.track?.artistNameDisplay ?? 'Unknown artist'} / @
                      {entry.content.creator.handle}
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>

            <Card
              title="Collection lanes"
              subtitle="Blocos simples para ajudar o usuario a entender o catalogo como colecao, nao como lista tecnica."
            >
              <Grid min={220}>
                <Card title="Late night" subtitle="Dark, ambient e cinematico.">
                  <p style={helperTextStyle}>
                    Bom para mostrar identidade e diferenciar Echo de uma playlist generica.
                  </p>
                </Card>
                <Card title="Repeat and chill" subtitle="Lo-fi, soft electronic e faixas para save.">
                  <p style={helperTextStyle}>
                    Essa lane deve ajudar o usuario a voltar, nao apenas testar uma vez.
                  </p>
                </Card>
                <Card title="Edge of feed" subtitle="Experimental, mas ainda ouvivel.">
                  <p style={helperTextStyle}>
                    Serve para provar novidade sem transformar o app em caos.
                  </p>
                </Card>
              </Grid>
            </Card>

            <Card
              title="Discovery map"
              subtitle="Taxonomia inicial do Echo organizada com mais cara de descoberta editorial."
            >
              <Stack gap={12}>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <Pill label={`Rank ${category.rankOrder}`} tone="accent" />
                      <Pill
                        label={category.activeFlag ? 'Em circulacao' : 'Dormindo'}
                        tone={category.activeFlag ? 'success' : 'warning'}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontWeight: 700 }}>{category.displayName}</div>
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>{category.slug}</div>
                    <p style={{ ...helperTextStyle, marginTop: 10 }}>
                      Categoria pronta para ajudar o algoritmo a distribuir descoberta com menos
                      ruido no inicio.
                    </p>
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid>
        ) : null}
        {!loading && viewerMode === 'listener' && activeTab === 'creators' ? (
          <Grid min={360}>
            <Grid min={220}>
              <MetricCard
                label="Ja seguindo"
                value={followedCreators.length}
                note="Nomes que o listener demo ja marcou para voltar depois."
              />
              <MetricCard
                label="Primeira aposta"
                value={firstBetCreators.length}
                note="Creators que ainda nao foram seguidos, mas ja parecem bons candidatos."
              />
              <MetricCard
                label="Mais ativos"
                value={risingCreators[0]?.publishedContentCountCached ?? 0}
                note="Quantidade de faixas do creator mais produtivo no catalogo atual."
              />
            </Grid>

            <Card
              title="Radar"
              subtitle="Creators que ja estao no radar do listener demo, com mais cara de talento acompanhado."
            >
              <Stack gap={12}>
                {followedCreators[0] ? (
                  <div
                    style={{
                      display: 'grid',
                      gap: 16,
                      gridTemplateColumns: '96px 1fr',
                      padding: 16,
                      borderRadius: 20,
                      background: 'rgba(10, 22, 40, 0.72)',
                      border: '1px solid rgba(59, 130, 246, 0.24)',
                    }}
                  >
                    <div style={{ ...buildArtworkStyle(followedCreators[0].creator.id), width: 96, minWidth: 96, borderRadius: 20 }} />
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        <Pill label="Following" tone="success" />
                        <Pill label="Em observacao" tone="accent" />
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>
                        {followedCreators[0].creator.displayName}
                      </div>
                      <div style={{ marginTop: 4, color: '#8da3ca' }}>
                        @{followedCreators[0].creator.handle}
                      </div>
                    </div>
                  </div>
                ) : null}
                {followedCreators.length === 0 ? (
                  <p style={helperTextStyle}>
                    O listener demo ainda nao seguiu nenhum creator. Este bloco deve virar um
                    painel de nomes que merecem retorno.
                  </p>
                ) : null}
                {followedCreators.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <Pill label="Following" tone="success" />
                    </div>
                    <div style={{ fontWeight: 700 }}>{entry.creator.displayName}</div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{entry.creator.handle}</div>
                  </div>
                ))}
              </Stack>
            </Card>

            <Card
              title="Primeira aposta"
              subtitle="O Echo precisa mostrar alguns nomes que ainda nao foram seguidos, mas ja pedem curiosidade."
            >
              <Stack gap={12}>
                {firstBetCreators.map((creator) => (
                  <div
                    key={creator.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                        <div style={{ marginTop: 4, color: '#8da3ca' }}>@{creator.handle}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <Pill label={creator.creatorTier} tone={getCreatorTierTone(creator.creatorTier)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 8, color: '#8da3ca' }}>
                      {creator.publishedContentCountCached} faixas publicadas /{' '}
                      {creator.followerCountCached} seguidores
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <ActionButton label="Seguir cedo" onClick={() => handleFollow(creator.id)} />
                    </div>
                    {feedbackByCreator[creator.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>
                        {feedbackByCreator[creator.id]}
                      </p>
                    ) : null}
                  </div>
                ))}
                <p style={helperTextStyle}>
                  Seguir no Echo precisa parecer descoberta antecipada. O usuario nao esta apenas
                  guardando um nome. Ele esta dizendo: quero voltar antes que esse creator estoure.
                </p>
              </Stack>
            </Card>

            <Card
              title="Creator board"
              subtitle="Base atual de creators com identidade, status e sinais claros de crescimento."
            >
              <Stack gap={12}>
                {risingCreators.map((creator) => (
                  <div
                    key={creator.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ ...buildArtworkStyle(creator.id), width: 64, minWidth: 64, borderRadius: 18 }} />
                        <div style={{ fontWeight: 700 }}>{creator.displayName}</div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <Pill label={creator.creatorTier} tone={getCreatorTierTone(creator.creatorTier)} />
                        <Pill label={creator.creatorStatus} tone="default" />
                      </div>
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{creator.handle}</div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>
                      {creator.followerCountCached} followers / {creator.publishedContentCountCached}{' '}
                      items
                    </div>
                    {creator.bio ? (
                      <p style={{ marginBottom: 0, color: '#c6d4ee' }}>{creator.bio}</p>
                    ) : null}
                    <div style={{ marginTop: 14 }}>
                      <ActionButton
                        label={followedCreatorIds.has(creator.id) ? 'Ja seguido' : 'Seguir'}
                        onClick={() => handleFollow(creator.id)}
                      />
                    </div>
                    {feedbackByCreator[creator.id] ? (
                      <p style={{ marginBottom: 0, color: '#86efac' }}>
                        {feedbackByCreator[creator.id]}
                      </p>
                    ) : null}
                  </div>
                ))}
                <p style={helperTextStyle}>
                  Este bloco precisa funcionar como uma pequena vitrine de talentos em ascensao:
                  poucos nomes, sinais simples e vontade de acompanhar.
                </p>
              </Stack>
            </Card>
          </Grid>
        ) : null}

        {!loading && viewerMode === 'creator' && activeTab === 'upload' ? (
          <Grid min={380}>
            <Card
              title="Step 1: Creator setup"
              subtitle="Entrada minima de creator com mais cara de onboarding do que formulario cru."
            >
              <Stack gap={14}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Pill label="Passo 1" tone="accent" />
                  <Pill label="Conta + perfil" tone="success" />
                </div>
                <p style={helperTextStyle}>
                  Esse e o caminho minimo ja provado na API: criar conta, gerar perfil de creator e
                  voltar direto para o upload.
                </p>
                <Field label="Creator email">
                  <input
                    value={setupEmail}
                    onChange={(event) => setSetupEmail(event.target.value)}
                    style={inputStyle}
                    placeholder="creator@example.com"
                  />
                </Field>
                <Field label="Artist display name">
                  <input
                    value={setupDisplayName}
                    onChange={(event) => setSetupDisplayName(event.target.value)}
                    style={inputStyle}
                    placeholder="Nome artistico"
                  />
                </Field>
                <Field label="Handle">
                  <input
                    value={setupHandle}
                    onChange={(event) => setSetupHandle(event.target.value)}
                    style={inputStyle}
                    placeholder="handle"
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    value={setupBio}
                    onChange={(event) => setSetupBio(event.target.value)}
                    style={textAreaStyle}
                    placeholder="Bio curta opcional"
                  />
                </Field>
                <ActionButton
                  label={creatingCreator ? 'Criando creator...' : 'Criar conta e perfil de creator'}
                  onClick={handleCreatorSetup}
                  disabled={creatingCreator}
                />
                {setupResultMessage ? (
                  <Notice title="Resultado do creator setup" tone="success">
                    {setupResultMessage}
                  </Notice>
                ) : null}
              </Stack>
            </Card>

            <Card
              title="Step 2: Track upload"
              subtitle="Ingestao real de faixa conectada ao backend do Echo, agora com leitura mais guiada."
            >
              <Stack gap={14}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Pill label="Passo 2" tone="accent" />
                  <Pill label="Faixa + metadata" tone="success" />
                </div>
                <Notice title="Antes de publicar" tone="info">
                  Confirme creator, titulo, artista, categoria e declaracao de IA. Essa tela e o
                  ponto minimo de entrada do catalogo.
                </Notice>
                <Field label="Choose creator">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {creators.map((creator) => (
                      <Chip
                        key={creator.id}
                        selected={creator.id === creatorId}
                        label={creator.displayName}
                        onClick={() => {
                          setCreatorId(creator.id);
                          if (!artistNameDisplay.trim()) {
                            setArtistNameDisplay(creator.displayName);
                          }
                        }}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Creator ID">
                  <input
                    value={creatorId}
                    onChange={(event) => setCreatorId(event.target.value)}
                    style={inputStyle}
                  />
                </Field>

                <Field label="Track title">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    style={inputStyle}
                    placeholder="Track title"
                  />
                </Field>

                <Field label="Artist display name">
                  <input
                    value={artistNameDisplay}
                    onChange={(event) => setArtistNameDisplay(event.target.value)}
                    style={inputStyle}
                    placeholder="Artist display name"
                  />
                </Field>

                <Field label="Choose category">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {categories.map((category) => (
                      <Chip
                        key={category.id}
                        selected={category.id === primaryCategoryId}
                        label={category.displayName}
                        onClick={() => setPrimaryCategoryId(category.id)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    style={textAreaStyle}
                    placeholder="Description"
                  />
                </Field>

                <Field label="Source tool">
                  <input
                    value={sourceToolOptional}
                    onChange={(event) => setSourceToolOptional(event.target.value)}
                    style={inputStyle}
                    placeholder="Optional source tool"
                  />
                </Field>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 700,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={aiDeclaration}
                    onChange={(event) => setAiDeclaration(event.target.checked)}
                  />
                  AI declaration confirmed
                </label>

                <ActionButton
                  label={submitting ? 'Submitting...' : 'Submit track'}
                  onClick={handleSubmitTrack}
                  disabled={submitting}
                />
                {uploadMessage ? (
                  <Notice title="Resultado do upload" tone="success">
                    {uploadMessage}
                  </Notice>
                ) : null}
              </Stack>
            </Card>
          </Grid>
        ) : null}
      </Stack>
    </PageShell>
  );
}
