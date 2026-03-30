import { EchoCreator, EchoTrack } from './api';

export type ReleaseStateLabel = 'Ativa' | 'Fria' | 'Dormindo';

export interface CreatorTrackState {
  label: ReleaseStateLabel;
  tone: 'success' | 'warning' | 'default';
}

export interface CreatorFocusCard {
  label: string;
  value: string;
  note: string;
  tone: 'success' | 'warning' | 'default' | 'accent';
}

export interface CreatorTrackAdvice {
  trackId: string;
  title: string;
  state: ReleaseStateLabel;
  advice: string;
  actionLabel: string;
}

export interface CreatorReadinessItem {
  label: string;
  done: boolean;
}

export interface CreatorOnboardingStep {
  label: string;
  done: boolean;
  note: string;
}

export interface CreatorWeekOneMetric {
  label: string;
  value: string;
  note: string;
  tone: 'success' | 'warning' | 'default' | 'accent';
}

export interface CreatorWorkspaceSnapshot {
  totalTracks: number;
  activeTracks: EchoTrack[];
  coldTracks: EchoTrack[];
  dormantTracks: EchoTrack[];
  recommendedAction: string;
  recentTracks: EchoTrack[];
  focusCards: CreatorFocusCard[];
  trackAdvice: CreatorTrackAdvice[];
  readinessLabel: string;
  readinessTone: 'success' | 'warning' | 'default';
  readinessItems: CreatorReadinessItem[];
  weekOneMetrics: CreatorWeekOneMetric[];
  operatorWatchlist: string[];
  creatorGoal: string;
  onboardingStateLabel: string;
  onboardingSteps: CreatorOnboardingStep[];
}

export function getCreatorTrackState(track: EchoTrack): CreatorTrackState {
  if (track.contentState !== 'published' || track.visibilityState === 'hidden') {
    return { label: 'Dormindo', tone: 'default' };
  }

  if (track.visibilityState === 'suppressed') {
    return { label: 'Fria', tone: 'warning' };
  }

  return { label: 'Ativa', tone: 'success' };
}

export function buildCreatorWorkspaceSnapshot(
  creator: EchoCreator | null,
  tracks: EchoTrack[],
  activeTrackLimit: number,
) {
  if (!creator) {
    return {
      totalTracks: 0,
      activeTracks: [],
      coldTracks: [],
      dormantTracks: [],
      recommendedAction: 'Ative um creator para abrir o workspace de publicacao.',
      recentTracks: [],
      focusCards: [],
      trackAdvice: [],
      readinessLabel: 'Sem creator ativo',
      readinessTone: 'default',
      readinessItems: [],
      weekOneMetrics: [],
      operatorWatchlist: [],
      creatorGoal: 'Ative um creator para destravar a primeira semana de teste.',
      onboardingStateLabel: 'Sem entrada no workspace',
      onboardingSteps: [],
    } satisfies CreatorWorkspaceSnapshot;
  }

  const selectedCreatorTracks = tracks
    .filter((track) => track.creator.id === creator.id)
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  const activeTracks = selectedCreatorTracks.filter(
    (track) => track.contentState === 'published' && track.visibilityState === 'visible',
  );
  const coldTracks = selectedCreatorTracks.filter(
    (track) => track.contentState === 'published' && track.visibilityState === 'suppressed',
  );
  const dormantTracks = selectedCreatorTracks.filter(
    (track) => track.contentState !== 'published' || track.visibilityState === 'hidden',
  );

  let recommendedAction = 'Preparar a proxima faixa com calma e manter o catalogo principal limpo.';

  if (activeTracks.length >= activeTrackLimit) {
    recommendedAction =
      'O limite ativo esta cheio. A proxima boa jogada e colocar uma faixa para dormir antes de tentar empurrar outra.';
  } else if (coldTracks.length > 0) {
    recommendedAction =
      'Voce ja tem faixas frias. Vale revisar o que deve voltar, dormir ou ficar fora da abertura principal.';
  } else if (selectedCreatorTracks.length === 0) {
    recommendedAction =
      'Primeiro passo: subir a faixa de abertura e testar a identidade desse artista no Echo.';
  } else if (activeTracks.length <= 3) {
    recommendedAction =
      'Ainda ha espaco para fortalecer a assinatura do artista com mais uma ou duas faixas bem escolhidas.';
  }

  const focusCards: CreatorFocusCard[] = [
    {
      label: 'Ativas',
      value: `${activeTracks.length}/${activeTrackLimit}`,
      note:
        activeTracks.length >= activeTrackLimit
          ? 'Cheio: a proxima faixa forte deve trocar com outra.'
          : 'Ainda ha espaco no catalogo principal.',
      tone: activeTracks.length >= activeTrackLimit ? 'warning' : 'success',
    },
    {
      label: 'Frias',
      value: String(coldTracks.length),
      note:
        coldTracks.length > 0
          ? 'Vale decidir o que reativar, dormir ou deixar quieto.'
          : 'Nenhuma faixa fria pedindo decisao agora.',
      tone: coldTracks.length > 0 ? 'warning' : 'default',
    },
    {
      label: 'Dormindo',
      value: String(dormantTracks.length),
      note:
        dormantTracks.length > 0
          ? 'Catalogo guardado e pronto para voltar depois.'
          : 'Ainda nao ha backlog adormecido.',
      tone: dormantTracks.length > 0 ? 'accent' : 'default',
    },
  ];

  const trackAdvice = selectedCreatorTracks.slice(0, 5).map((track) => {
    const state = getCreatorTrackState(track);

    if (state.label === 'Ativa') {
      return {
        trackId: track.id,
        title: track.title,
        state: state.label,
        advice: 'Boa candidata para servir de molde do proximo lancamento.',
        actionLabel: 'Usar como base',
      } satisfies CreatorTrackAdvice;
    }

    if (state.label === 'Fria') {
      return {
        trackId: track.id,
        title: track.title,
        state: state.label,
        advice: 'Precisa de decisao: reativar mais tarde ou empurrar para sono.',
        actionLabel: 'Revisar faixa fria',
      } satisfies CreatorTrackAdvice;
    }

    return {
      trackId: track.id,
      title: track.title,
      state: state.label,
      advice: 'Pode voltar no futuro sem pesar no catalogo principal agora.',
      actionLabel: 'Usar como base',
    } satisfies CreatorTrackAdvice;
  });

  const readinessItems: CreatorReadinessItem[] = [
    { label: 'persona ativa escolhida', done: Boolean(creator.id) },
    { label: 'bio minima pronta', done: Boolean(creator.bio?.trim()) },
    { label: 'uma faixa principal ativa', done: activeTracks.length >= 1 },
    { label: 'pelo menos duas faixas no workspace', done: selectedCreatorTracks.length >= 2 },
    {
      label: 'tem faixa no room principal',
      done: activeTracks.some((track) => (track.track?.accessRoom ?? 'standard') === 'standard'),
    },
  ];

  const readinessScore = readinessItems.filter((item) => item.done).length;
  const readinessLabel =
    readinessScore === readinessItems.length
      ? 'Pronta para beta'
      : readinessScore >= 3
        ? 'Quase pronta'
        : 'Ainda em preparo';
  const readinessTone =
    readinessScore === readinessItems.length
      ? 'success'
      : readinessScore >= 3
        ? 'warning'
        : 'default';

  const mainRoomActiveCount = activeTracks.filter(
    (track) => (track.track?.accessRoom ?? 'standard') === 'standard',
  ).length;
  const activeHeadroom = Math.max(0, activeTrackLimit - activeTracks.length);
  const publishedTrackCount = activeTracks.length + coldTracks.length;
  const reserveCount = coldTracks.length + dormantTracks.length;
  const weekOneMetrics: CreatorWeekOneMetric[] = [
    {
      label: 'Abertura',
      value: `${mainRoomActiveCount}`,
      note:
        mainRoomActiveCount === 0
          ? 'Sem faixa principal pronta para segurar a entrada.'
          : mainRoomActiveCount === 1
            ? 'Ja da para entrar com cuidado na beta.'
            : 'A persona ja tem um nucleo forte para abrir a semana.',
      tone:
        mainRoomActiveCount >= 2 ? 'success' : mainRoomActiveCount === 1 ? 'accent' : 'warning',
    },
    {
      label: 'Folga ativa',
      value: `${activeHeadroom}`,
      note:
        activeHeadroom === 0
          ? 'Nao ha folga. A proxima faixa pede troca.'
          : activeHeadroom <= 3
            ? 'Ainda cabe mais uma rodada curta de teste.'
            : 'Ha espaco para publicar sem sufocar o catalogo.',
      tone: activeHeadroom === 0 ? 'warning' : activeHeadroom <= 3 ? 'accent' : 'success',
    },
    {
      label: 'Publicadas',
      value: `${publishedTrackCount}`,
      note:
        publishedTrackCount >= 3
          ? 'Ja existe material suficiente para observar retorno.'
          : 'Ainda falta volume minimo para ler o comportamento do creator.',
      tone: publishedTrackCount >= 3 ? 'success' : 'warning',
    },
    {
      label: 'Reserva',
      value: `${reserveCount}`,
      note:
        reserveCount === 0
          ? 'Ainda nao existe fila de protecao para testar reativacao.'
          : reserveCount <= 3
            ? 'Reserva enxuta, boa para uma beta pequena.'
            : 'Ha bastante material fora da abertura; vale vigiar o excesso.',
      tone: reserveCount === 0 ? 'default' : reserveCount <= 3 ? 'accent' : 'warning',
    },
  ];

  const operatorWatchlist = [
    mainRoomActiveCount === 0 ? 'Sem faixa principal ativa; nao mover para onboarded ainda.' : null,
    selectedCreatorTracks.length < 2
      ? 'Ainda nao ha segundo upload para testar retorno natural.'
      : null,
    activeTracks.length >= activeTrackLimit
      ? 'Catalogo ativo cheio logo no inicio; revisar o que deve dormir.'
      : null,
    coldTracks.length > activeTracks.length
      ? 'Ha mais faixa fria do que faixa viva; a abertura pode estar fraca.'
      : null,
    readinessScore < readinessItems.length
      ? 'A persona ainda pede rescue em algum ponto do intake.'
      : null,
  ].filter((entry): entry is string => Boolean(entry));

  let creatorGoal = 'Entrar na beta com uma faixa principal forte e uma segunda pronta para sustentar retorno.';

  if (mainRoomActiveCount === 0) {
    creatorGoal = 'Subir uma faixa principal antes de tentar qualquer abertura real.';
  } else if (selectedCreatorTracks.length < 2) {
    creatorGoal = 'Preparar o segundo upload para provar que essa persona consegue voltar sozinha.';
  } else if (activeHeadroom === 0) {
    creatorGoal = 'Escolher o que esfria ou dorme antes de empurrar outro lancamento.';
  }

  const onboardingSteps: CreatorOnboardingStep[] = [
    {
      label: 'persona escolhida',
      done: Boolean(creator.id),
      note: 'Escolher claramente qual artista entra primeiro na onda inicial.',
    },
    {
      label: 'setup minimo pronto',
      done: Boolean(creator.bio?.trim()),
      note: 'Bio curta pronta para evitar rescue basico.',
    },
    {
      label: 'primeira faixa principal',
      done: mainRoomActiveCount >= 1,
      note: 'A persona precisa de pelo menos uma faixa viva no room principal.',
    },
    {
      label: 'segundo upload feito',
      done: selectedCreatorTracks.length >= 2,
      note: 'A segunda faixa prova que o loop nao depende de empurrao manual.',
    },
    {
      label: 'pronta para onboarded',
      done: readinessScore === readinessItems.length,
      note: 'So aqui a persona deve sair de accepted e entrar em onboarded.',
    },
  ];

  const onboardingStateLabel =
    readinessScore === readinessItems.length
      ? 'Onboarded'
      : selectedCreatorTracks.length >= 1 || Boolean(creator.bio?.trim())
        ? 'Accepted em preparo'
        : 'Aceite ainda sem tracao';

  return {
    totalTracks: selectedCreatorTracks.length,
    activeTracks,
    coldTracks,
    dormantTracks,
    recommendedAction,
    recentTracks: selectedCreatorTracks.slice(0, 5),
    focusCards,
    trackAdvice,
    readinessLabel,
    readinessTone,
    readinessItems,
    weekOneMetrics,
    operatorWatchlist,
    creatorGoal,
    onboardingStateLabel,
    onboardingSteps,
  } satisfies CreatorWorkspaceSnapshot;
}
