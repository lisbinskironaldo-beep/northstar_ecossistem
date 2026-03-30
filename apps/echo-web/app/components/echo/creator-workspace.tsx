'use client';

import { CSSProperties, useMemo, useState } from 'react';
import { EchoCategory, EchoCreator, EchoTrack } from '../../lib/api';
import { ACCESS_ROOMS, AccessRoomId, getAccessRoomMeta } from '../../lib/access-rooms';
import { buildCreatorWorkspaceSnapshot, getCreatorTrackState } from '../../lib/creator-workspace';
import {
  ActionButton,
  Card,
  Chip,
  Field,
  Grid,
  MetricCard,
  Notice,
  Pill,
  Stack,
  TabButton,
  helperTextStyle,
  inputStyle,
  textAreaStyle,
} from '../ui';

type WorkspaceTabId = 'workspace' | 'artists' | 'release';

const workspaceTabs: Array<{ id: WorkspaceTabId; label: string; description: string }> = [
  { id: 'workspace', label: 'Workspace', description: 'Conta, frentes e base do creator.' },
  { id: 'artists', label: 'Artists', description: 'Personas publicas e espacos futuros.' },
  { id: 'release', label: 'Release room', description: 'Setup e publicacao no Echo.' },
];

function buildArtworkStyle(seed: string): CSSProperties {
  const palette = [
    ['#0f172a', '#2563eb'],
    ['#111827', '#0891b2'],
    ['#172554', '#7c3aed'],
    ['#1f2937', '#ea580c'],
    ['#0b1120', '#14b8a6'],
  ];
  const index =
    seed.split('').reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0) %
    palette.length;
  const [from, to] = palette[index];

  return {
    width: 84,
    minWidth: 84,
    aspectRatio: '1 / 1',
    borderRadius: 20,
    background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 30%), linear-gradient(145deg, ${from}, ${to})`,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.28)',
  };
}

function getCreatorTierTone(tier: string): 'default' | 'accent' | 'success' | 'warning' {
  if (tier.toLowerCase().includes('elite') || tier.toLowerCase().includes('prime')) {
    return 'success';
  }

  if (tier.toLowerCase().includes('rising') || tier.toLowerCase().includes('viral')) {
    return 'accent';
  }

  return 'warning';
}

function mapReadinessTone(
  tone: 'success' | 'warning' | 'default',
): 'success' | 'warning' | 'info' {
  return tone === 'default' ? 'info' : tone;
}

export interface CreatorWorkspaceProps {
  creators: EchoCreator[];
  tracks: EchoTrack[];
  categories: EchoCategory[];
  creatorId: string;
  setCreatorId: (value: string) => void;
  setupEmail: string;
  setSetupEmail: (value: string) => void;
  setupDisplayName: string;
  setSetupDisplayName: (value: string) => void;
  setupHandle: string;
  setSetupHandle: (value: string) => void;
  setupBio: string;
  setSetupBio: (value: string) => void;
  setupResultMessage: string | null;
  creatingCreator: boolean;
  onCreateCreator: () => void;
  title: string;
  setTitle: (value: string) => void;
  artistNameDisplay: string;
  setArtistNameDisplay: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  sourceToolOptional: string;
  setSourceToolOptional: (value: string) => void;
  primaryCategoryId: string;
  setPrimaryCategoryId: (value: string) => void;
  aiDeclaration: boolean;
  setAiDeclaration: (value: boolean) => void;
  accessRoom: AccessRoomId;
  setAccessRoom: (value: AccessRoomId) => void;
  uploadMessage: string | null;
  submitting: boolean;
  onSubmitTrack: () => void;
}

export function CreatorWorkspace({
  creators,
  tracks,
  categories,
  creatorId,
  setCreatorId,
  setupEmail,
  setSetupEmail,
  setupDisplayName,
  setSetupDisplayName,
  setupHandle,
  setSetupHandle,
  setupBio,
  setSetupBio,
  setupResultMessage,
  creatingCreator,
  onCreateCreator,
  title,
  setTitle,
  artistNameDisplay,
  setArtistNameDisplay,
  description,
  setDescription,
  sourceToolOptional,
  setSourceToolOptional,
  primaryCategoryId,
  setPrimaryCategoryId,
  aiDeclaration,
  setAiDeclaration,
  accessRoom,
  setAccessRoom,
  uploadMessage,
  submitting,
  onSubmitTrack,
}: CreatorWorkspaceProps) {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTabId>('workspace');

  const activeCreator = useMemo(
    () => creators.find((creator) => creator.id === creatorId) ?? creators[0] ?? null,
    [creatorId, creators],
  );

  const futureArtistSlots = Math.max(0, 3 - creators.length);
  const activeArtistCount = activeCreator ? 1 : 0;
  const activeTrackLimit = 12;
  const dormantTrackLimit = 24;

  const selectedCreatorTracks = useMemo(
    () => tracks.filter((track) => track.creator.id === activeCreator?.id),
    [activeCreator?.id, tracks],
  );

  const selectedCreatorActiveTracks = useMemo(
    () =>
      selectedCreatorTracks.filter(
        (track) => track.contentState === 'published' && track.visibilityState === 'visible',
      ),
    [selectedCreatorTracks],
  );

  const selectedCreatorColdTracks = useMemo(
    () =>
      selectedCreatorTracks.filter(
        (track) => track.contentState === 'published' && track.visibilityState === 'suppressed',
      ),
    [selectedCreatorTracks],
  );

  const selectedCreatorDormantTracks = useMemo(
    () =>
      selectedCreatorTracks.filter(
        (track) => track.contentState !== 'published' || track.visibilityState === 'hidden',
      ),
    [selectedCreatorTracks],
  );

  const accountDormantTracks = useMemo(
    () =>
      tracks.filter(
        (track) => track.contentState !== 'published' || track.visibilityState !== 'visible',
      ).length,
    [tracks],
  );

  const workspaceSnapshot = useMemo(
    () => buildCreatorWorkspaceSnapshot(activeCreator, tracks, activeTrackLimit),
    [activeCreator, activeTrackLimit, tracks],
  );

  function applyReleaseTemplate(track: EchoTrack) {
    setArtistNameDisplay(track.track?.artistNameDisplay ?? track.creator.displayName);
    setPrimaryCategoryId(track.primaryCategory?.id ?? '');
    setDescription(track.description ?? '');
    setSourceToolOptional(track.track?.sourceToolOptional ?? '');
    setAccessRoom((track.track?.accessRoom as AccessRoomId | undefined) ?? 'standard');
  }

  return (
    <Stack gap={18}>
      <Card
        title="Creator workspace"
        subtitle="Uma conta, varios artistas publicos, uma camada pronta para Echo agora e Pulse/Lumen depois."
        accent="rgba(249, 115, 22, 0.35)"
      >
        <Stack gap={16}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Pill label="Northstar account" tone="default" />
            <Pill label="Creator workspace" tone="accent" />
            <Pill label="Echo live" tone="success" />
            <Pill label="Pulse next" tone="warning" />
            <Pill label="Lumen later" tone="default" />
          </div>
          <p style={helperTextStyle}>
            O ouvinte nao precisa ver isso o tempo todo. Mas para o creator, esta area precisa ser
            clara: uma identidade forte por dentro e varias personas publicas por fora.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {workspaceTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={workspaceTab === tab.id}
                onClick={() => setWorkspaceTab(tab.id)}
                label={tab.label}
                description={tab.description}
              />
            ))}
          </div>
        </Stack>
      </Card>

      {workspaceTab === 'workspace' ? (
        <Grid min={260}>
          <Card
            title="Workspace core"
            subtitle="A parte fixa da identidade, sem poluir o app do ouvinte."
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label="Conta unica" tone="success" />
                <Pill label="Creator ativavel" tone="accent" />
                <Pill label="Multi-artist ready" tone="warning" />
              </div>
              <p style={helperTextStyle}>
                O mesmo acesso pode ouvir, salvar, construir biblioteca e operar artistas publicos
                diferentes sem criar varias contas soltas.
              </p>
              <Grid min={150}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{activeArtistCount}/1</div>
                  <div style={{ color: '#8da3ca' }}>artista ativo</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{creators.length}/3</div>
                  <div style={{ color: '#8da3ca' }}>personas usadas</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>
                    {selectedCreatorActiveTracks.length}/{activeTrackLimit}
                  </div>
                  <div style={{ color: '#8da3ca' }}>faixas ativas</div>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>
                    {accountDormantTracks}/{dormantTrackLimit}
                  </div>
                  <div style={{ color: '#8da3ca' }}>adormecidas</div>
                </div>
              </Grid>
              <Notice title="Modelo gratuito atual" tone="info">
                Conta gratis: 1 artista ativo, ate 12 faixas em circulacao, ate 24 faixas
                adormecidas e ate 3 personas armazenadas no workspace.
              </Notice>
            </Stack>
          </Card>

          <Card
            title="Front horizon"
            subtitle="O creator ja sente que o Echo e a primeira porta do ecossistema."
          >
            <Grid min={150}>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Echo</div>
                <p style={helperTextStyle}>musica, descoberta e base</p>
              </div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6, color: '#c084fc' }}>Pulse</div>
                <p style={helperTextStyle}>clips e expansao depois</p>
              </div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6, color: '#f59e0b' }}>Lumen</div>
                <p style={helperTextStyle}>obras longas no futuro</p>
              </div>
            </Grid>
          </Card>

          <Card
            title="Access rooms"
            subtitle="Classificacao de acesso separada do clima ou genero da musica."
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ACCESS_ROOMS.map((room) => (
                  <Chip
                    key={room.id}
                    selected={room.id === accessRoom}
                    label={room.label}
                    onClick={() => setAccessRoom(room.id)}
                  />
                ))}
              </div>
              <Notice
                title={`Room ativa: ${getAccessRoomMeta(accessRoom).label}`}
                tone={accessRoom === 'standard' ? 'success' : 'warning'}
              >
                {getAccessRoomMeta(accessRoom).note}
              </Notice>
            </Stack>
          </Card>
        </Grid>
      ) : null}

      {workspaceTab === 'artists' ? (
        <Grid min={320}>
          <Card
            title="Artist personas"
            subtitle="Personas publicas independentes, ligadas a uma conta forte por tras."
          >
            <Stack gap={14}>
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  style={{
                    border: `1px solid ${creator.id === creatorId ? 'rgba(59, 130, 246, 0.55)' : '#1d3557'}`,
                    borderRadius: 20,
                    padding: 16,
                    background:
                      creator.id === creatorId
                        ? 'rgba(15, 23, 42, 0.96)'
                        : 'rgba(7, 17, 31, 0.82)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 14 }}>
                    <div style={buildArtworkStyle(creator.id)} />
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                        <Pill
                          label={creator.id === creatorId ? 'Ativo agora' : 'Disponivel'}
                          tone={creator.id === creatorId ? 'accent' : 'default'}
                        />
                        <Pill
                          label={creator.creatorTier}
                          tone={getCreatorTierTone(creator.creatorTier)}
                        />
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{creator.displayName}</div>
                      <div style={{ marginTop: 4, color: '#8da3ca' }}>@{creator.handle}</div>
                      <div style={{ marginTop: 6, color: '#8da3ca' }}>
                        {creator.publishedContentCountCached} faixas / {creator.followerCountCached}{' '}
                        seguidores
                      </div>
                      <div style={{ marginTop: 6, color: '#8da3ca' }}>
                        {tracks.filter((track) => track.creator.id === creator.id).length} itens no
                        workspace
                      </div>
                      {creator.bio ? <p style={{ ...helperTextStyle, marginTop: 8 }}>{creator.bio}</p> : null}
                      <div style={{ marginTop: 12 }}>
                        <ActionButton
                          label={creator.id === creatorId ? 'Persona ativa' : 'Usar esta persona'}
                          onClick={() => {
                            setCreatorId(creator.id);
                            setArtistNameDisplay(creator.displayName);
                          }}
                          tone={creator.id === creatorId ? 'secondary' : 'default'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Stack>
          </Card>

          <Card
            title="Future slots"
            subtitle="Espacos reservados para o creator crescer sem criar varias contas."
          >
            <Stack gap={12}>
              {futureArtistSlots > 0 ? (
                Array.from({ length: futureArtistSlots }).map((_, index) => (
                  <div
                    key={`future-slot-${index}`}
                    style={{
                      border: '1px dashed rgba(148, 163, 184, 0.42)',
                      borderRadius: 20,
                      padding: 18,
                      background: 'rgba(7, 17, 31, 0.52)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <Pill label="Slot reservado" tone="warning" />
                    </div>
                    <div style={{ fontWeight: 800 }}>Nova persona publica</div>
                    <p style={{ ...helperTextStyle, marginTop: 8 }}>
                      O workspace ja nasce preparado para novas assinaturas artisticas, sem
                      quebrar trust, moderacao ou faturamento futuro.
                    </p>
                  </div>
                ))
              ) : (
                <Notice title="Workspace cheio nesta demo" tone="info">
                  Os proximos slots podem virar limite por plano, nivel de creator ou confianca
                  acumulada.
                </Notice>
              )}
            </Stack>
          </Card>

          <Card
            title="Activation rule"
            subtitle="Nao se trata de bloquear criatividade. Se trata de controlar o catalogo vivo."
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label="1 artista ativo" tone="success" />
                <Pill label="12 faixas ativas" tone="accent" />
                <Pill label="24 adormecidas" tone="warning" />
                <Pill label="36 por conta" tone="default" />
              </div>
              <p style={helperTextStyle}>
                A conta pode guardar mais de um projeto, mas o produto so empurra uma frente
                principal por vez. Isso protege qualidade, descoberta e custo.
              </p>
            </Stack>
          </Card>

          <Card
            title="Beta readiness"
            subtitle="Leitura simples para saber se esta persona ja pode entrar na primeira onda real."
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label={workspaceSnapshot.readinessLabel} tone={workspaceSnapshot.readinessTone} />
              </div>
              {workspaceSnapshot.readinessItems.map((item) => (
                <div
                  key={item.label}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                >
                  <div style={{ color: '#dbe7ff' }}>{item.label}</div>
                  <Pill label={item.done ? 'ok' : 'faltando'} tone={item.done ? 'success' : 'default'} />
                </div>
              ))}
            </Stack>
          </Card>

          <Card
            title="Week 1 pulse"
            subtitle="As quatro leituras minimas para saber se essa persona aguenta a primeira semana."
          >
            <Stack gap={14}>
              <Grid min={150}>
                {workspaceSnapshot.weekOneMetrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    note={metric.note}
                  />
                ))}
              </Grid>
              <Notice title="Meta curta do creator" tone="info">
                {workspaceSnapshot.creatorGoal}
              </Notice>
              {workspaceSnapshot.operatorWatchlist.length > 0 ? (
                <Notice title="Olhar do operador" tone="warning">
                  <Stack gap={8}>
                    {workspaceSnapshot.operatorWatchlist.map((entry) => (
                      <div key={entry} style={{ color: '#dbe7ff' }}>
                        {entry}
                      </div>
                    ))}
                  </Stack>
                </Notice>
              ) : (
                <Notice title="Olhar do operador" tone="success">
                  Essa persona ja tem sinais suficientes para entrar na beta sem rescue constante.
                </Notice>
              )}
            </Stack>
          </Card>

          <Card
            title="Onboarding path"
            subtitle="Caminho simples para sair de accepted e chegar em onboarded sem rescue."
          >
            <Stack gap={12}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label={workspaceSnapshot.onboardingStateLabel} tone={workspaceSnapshot.readinessTone} />
              </div>
              {workspaceSnapshot.onboardingSteps.map((step) => (
                <div
                  key={step.label}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                >
                  <div>
                    <div style={{ color: '#dbe7ff' }}>{step.label}</div>
                    <div style={{ ...helperTextStyle, marginTop: 4 }}>{step.note}</div>
                  </div>
                  <Pill label={step.done ? 'ok' : 'pendente'} tone={step.done ? 'success' : 'default'} />
                </div>
              ))}
            </Stack>
          </Card>
        </Grid>
      ) : null}

      {workspaceTab === 'release' ? (
        <Grid min={380}>
          <Card
            title="Step 1: Creator setup"
            subtitle="Conta + perfil antes da primeira publicacao."
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label="Passo 1" tone="accent" />
                <Pill label="Conta + perfil" tone="success" />
              </div>
              <p style={helperTextStyle}>
                O setup minimo continua simples, mas agora faz parte do workspace, nao de um bloco
                perdido no app.
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
                label={creatingCreator ? 'Criando creator...' : 'Criar conta e perfil'}
                onClick={onCreateCreator}
                disabled={creatingCreator}
              />
              {creators.length > 0 ? (
                <Notice title="Setup ja destravado" tone="info">
                  O workspace ja tem persona pronta. Se quiser repetir publicacao agora, pode pular
                  este passo e ir direto para a release room.
                </Notice>
              ) : null}
              {setupResultMessage ? (
                <Notice title="Resultado do setup" tone="success">
                  {setupResultMessage}
                </Notice>
              ) : null}
            </Stack>
          </Card>

          <Card
            title="Step 2: Release room"
            subtitle="Publicacao do Echo com escolha de persona, categoria e acesso."
          >
            <Stack gap={14}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label="Passo 2" tone="accent" />
                <Pill label="Faixa + room" tone="success" />
              </div>
              <Notice title="Antes de publicar" tone="info">
                A musica entra por uma persona publica, mas a conta real continua segura por tras.
                Conteudos especiais devem nascer com room certa desde o upload.
              </Notice>
              <Notice title="Proximo melhor movimento" tone="info">
                {workspaceSnapshot.recommendedAction}
              </Notice>
              <Notice
                title={`Estado da beta: ${workspaceSnapshot.readinessLabel}`}
                tone={mapReadinessTone(workspaceSnapshot.readinessTone)}
              >
                A release room agora tambem mostra o quanto essa persona ja esta pronta para entrar na onda inicial.
              </Notice>
              <Notice title={`Estado de onboarding: ${workspaceSnapshot.onboardingStateLabel}`} tone="info">
                O creator nao vira onboarded por aceitar o convite. Ele so entra quando este caminho ja esta materialmente completo.
              </Notice>
              <Notice title="Meta curta desta persona" tone="info">
                {workspaceSnapshot.creatorGoal}
              </Notice>

              <Grid min={180}>
                {workspaceSnapshot.focusCards.map((card) => (
                  <MetricCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                    note={card.note}
                  />
                ))}
              </Grid>

              <Field label="Choose artist persona">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {creators.map((creator) => (
                    <Chip
                      key={creator.id}
                      selected={creator.id === creatorId}
                      label={creator.displayName}
                      onClick={() => {
                        setCreatorId(creator.id);
                        if (!artistNameDisplay.trim() || artistNameDisplay === activeCreator?.displayName) {
                          setArtistNameDisplay(creator.displayName);
                        }
                      }}
                    />
                  ))}
                </div>
              </Field>

              <Card
                title="Quick publish"
                subtitle="Atalhos para repetir publicacao sem reconfigurar tudo toda vez."
              >
                <Stack gap={12}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label="Usar nome da persona"
                      tone="secondary"
                      onClick={() => setArtistNameDisplay(activeCreator?.displayName ?? '')}
                    />
                    <ActionButton
                      label="Voltar para Main"
                      tone="secondary"
                      onClick={() => setAccessRoom('standard')}
                    />
                    <ActionButton
                      label="Limpar rascunho"
                      tone="secondary"
                      onClick={() => {
                        setTitle('');
                        setDescription('');
                        setSourceToolOptional('');
                        setPrimaryCategoryId(categories[0]?.id ?? '');
                        setAccessRoom('standard');
                        setArtistNameDisplay(activeCreator?.displayName ?? '');
                      }}
                    />
                  </div>
                  {workspaceSnapshot.recentTracks.length > 0 ? (
                    <Stack gap={10}>
                      {workspaceSnapshot.trackAdvice.slice(0, 3).map((entry) => {
                        const track = workspaceSnapshot.recentTracks.find(
                          (candidate) => candidate.id === entry.trackId,
                        );

                        if (!track) {
                          return null;
                        }

                        return (
                        <div
                          key={track.id}
                          style={{
                            border: '1px solid #1d3557',
                            borderRadius: 18,
                            padding: 14,
                            background: 'rgba(7, 17, 31, 0.82)',
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                            <Pill
                              label={getCreatorTrackState(track).label}
                              tone={getCreatorTrackState(track).tone}
                            />
                            {track.primaryCategory ? (
                              <Pill label={track.primaryCategory.displayName} tone="default" />
                            ) : null}
                            {track.track ? (
                              <Pill
                                label={getAccessRoomMeta(track.track.accessRoom as AccessRoomId).label}
                                tone={getAccessRoomMeta(track.track.accessRoom as AccessRoomId).tone}
                              />
                            ) : null}
                          </div>
                          <div style={{ fontWeight: 800 }}>{track.title}</div>
                          <div style={{ marginTop: 4, color: '#8da3ca' }}>{entry.advice}</div>
                          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            <ActionButton
                              label={entry.actionLabel}
                              tone="secondary"
                              onClick={() => applyReleaseTemplate(track)}
                            />
                          </div>
                        </div>
                      )})}
                    </Stack>
                  ) : (
                    <p style={helperTextStyle}>
                      Quando este artista tiver algumas faixas, o Echo vai deixar reaproveitar a base
                      de um lancamento anterior em vez de preencher tudo de novo.
                    </p>
                  )}
                </Stack>
              </Card>

              <Field label="Access room">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {ACCESS_ROOMS.map((room) => (
                    <Chip
                      key={room.id}
                      selected={room.id === accessRoom}
                      label={room.label}
                      onClick={() => setAccessRoom(room.id)}
                    />
                  ))}
                </div>
              </Field>

              {accessRoom !== 'standard' ? (
                <Notice title="Sala separada" tone="warning">
                  Esta room nao deve entrar no feed principal por padrao. O listener so encontra
                  isso se ativar esse tipo de acesso.
                </Notice>
              ) : null}

              <Grid min={180}>
                <Card title="Ativas agora" subtitle="As que circulam no produto.">
                  <Stack gap={8}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>
                      {selectedCreatorActiveTracks.length}/{activeTrackLimit}
                    </div>
                    <p style={helperTextStyle}>
                      Se passar do limite, a proxima faixa forte deve empurrar outra para dormir.
                    </p>
                  </Stack>
                </Card>
                <Card title="Frias" subtitle="Publicadas, mas fora da abertura principal.">
                  <Stack gap={8}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{selectedCreatorColdTracks.length}</div>
                    <p style={helperTextStyle}>
                      Continuam vivas, mas nao consomem a mesma distribuicao de uma faixa quente.
                    </p>
                  </Stack>
                </Card>
                <Card title="Adormecidas" subtitle="Guardadas para depois.">
                  <Stack gap={8}>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>
                      {selectedCreatorDormantTracks.length}/{dormantTrackLimit}
                    </div>
                    <p style={helperTextStyle}>
                      Ficam fora do catalogo vivo sem serem apagadas do workspace.
                    </p>
                  </Stack>
                </Card>
              </Grid>

              {selectedCreatorTracks.length > 0 ? (
                <Card
                  title="Current release map"
                  subtitle="Leitura rapida para o creator entender o que esta vivo, frio ou dormindo."
                >
                  <Stack gap={10}>
                    {selectedCreatorTracks.slice(0, 8).map((track) => {
                      const trackState = getCreatorTrackState(track);

                      return (
                        <div
                          key={track.id}
                          style={{
                            border: '1px solid #1d3557',
                            borderRadius: 18,
                            padding: 14,
                            background: 'rgba(7, 17, 31, 0.82)',
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                            <Pill label={trackState.label} tone={trackState.tone} />
                            {track.primaryCategory ? (
                              <Pill label={track.primaryCategory.displayName} tone="default" />
                            ) : null}
                            {track.track ? (
                              <Pill
                                label={getAccessRoomMeta(track.track.accessRoom as AccessRoomId).label}
                                tone={getAccessRoomMeta(track.track.accessRoom as AccessRoomId).tone}
                              />
                            ) : null}
                          </div>
                          <div style={{ fontWeight: 800 }}>{track.title}</div>
                          <div style={{ marginTop: 4, color: '#8da3ca' }}>
                            {track.description ?? 'Sem descricao curta ainda.'}
                          </div>
                          <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                            {workspaceSnapshot.trackAdvice.find((entry) => entry.trackId === track.id)
                              ?.advice ?? 'Faixa pronta para revisao.'}
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <ActionButton
                              label="Usar como base"
                              tone="secondary"
                              onClick={() => applyReleaseTemplate(track)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </Stack>
                </Card>
              ) : null}

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
                onClick={onSubmitTrack}
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
  );
}
