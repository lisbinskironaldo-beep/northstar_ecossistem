export type ListenerWorldId = 'artists' | 'categories' | 'moments' | 'outside';

export const listenerWorlds: Array<{
  id: ListenerWorldId;
  eyebrow: string;
  title: string;
  note: string;
}> = [
  {
    id: 'artists',
    eyebrow: 'Mundo',
    title: 'Artistas',
    note: 'rostos, fases e identidades que valem mais de uma escuta',
  },
  {
    id: 'categories',
    eyebrow: 'Mundo',
    title: 'Categorias',
    note: 'linhas principais para abrir rapido o catalogo certo',
  },
  {
    id: 'moments',
    eyebrow: 'Mundo',
    title: 'Ambientes',
    note: 'musicas pensadas para treino, foco, noite, viagem e mais',
  },
  {
    id: 'outside',
    eyebrow: 'Mundo',
    title: 'Fora do catalogo',
    note: 'kids, parodia, clones e faixas com acesso separado',
  },
];

export const momentChoices = [
  'treino pesado',
  'crossfit',
  'cardio',
  'foco',
  'noite',
  'viagem',
  'calma',
  'recovery',
] as const;

export const outsideRooms: Array<{ key: string; label: string; note: string }> = [
  { key: 'kids', label: 'Kids', note: 'linha infantil com entrada propria' },
  { key: 'parody', label: 'Parodia', note: 'versoes assumidas e liberadas pelo ouvinte' },
  { key: 'clone_inspired', label: 'Clones', note: 'inspiradas em vozes ou estilos existentes' },
  { key: 'explicit', label: '+18', note: 'conteudo sensivel fora do fluxo padrao' },
];

export const searchCategoryEntries = [
  {
    id: 'outside-catalog',
    title: 'Fora do catalogo',
    note: 'kids, +18, parody e clone',
  },
  {
    id: 'moments',
    title: 'Ambientes',
    note: 'treino, foco, noite e calma',
  },
  {
    id: 'styles',
    title: 'Estilos',
    note: 'linhas sonoras e moods',
  },
  {
    id: 'top-brasil',
    title: '50 mais Brasil',
    note: 'o que mais gira no pais',
  },
  {
    id: 'top-nearby',
    title: '50 mais perto',
    note: 'recorte local em 100 km',
  },
  {
    id: 'top-world',
    title: '50 mundo',
    note: 'o que mais gira la fora',
  },
  {
    id: 'launches',
    title: 'Lançamentos',
    note: 'o que entrou agora',
  },
] as const;

export const searchIntentEntries = [
  {
    id: 'small-artists',
    title: 'Artistas pequenos',
    note: 'nomes cedo, ainda perto do circulo',
    kind: 'artist' as const,
    color: '#9fd6ff',
  },
  {
    id: 'live-now',
    title: 'Ao vivo agora',
    note: 'radio, drop e show com atividade',
    kind: 'live' as const,
    color: '#8b5cf6',
  },
  {
    id: 'premiere-today',
    title: 'Estreia hoje',
    note: 'entradas quentes antes da liberacao total',
    kind: 'premiere' as const,
    color: '#ff5ca8',
  },
  {
    id: 'circle',
    title: 'Do meu circulo',
    note: 'quem voce segue ou ja puxou para perto',
    kind: 'circle' as const,
    color: '#67d6a3',
  },
  {
    id: 'dark',
    title: 'Dark',
    note: 'linhas mais densas, frias e noturnas',
    kind: 'style' as const,
    color: '#8e5cff',
  },
  {
    id: 'night',
    title: 'Noite',
    note: 'camadas mais escuras, lentas e atmosfericas',
    kind: 'moment' as const,
    color: '#5e7bff',
  },
  {
    id: 'training',
    title: 'Treino',
    note: 'cardio, crossfit e energia direta',
    kind: 'moment' as const,
    color: '#37b8ff',
  },
  {
    id: 'rising-fast',
    title: 'Subindo rapido',
    note: 'quem ja esta ganhando tracao sem virar massa ainda',
    kind: 'artist' as const,
    color: '#67d6a3',
  },
  {
    id: 'experimental',
    title: 'Experimental',
    note: 'riscos, texturas e saidas menos obvias',
    kind: 'style' as const,
    color: '#9b6dff',
  },
] as const;

export const creatorPlans = [
  {
    id: 'free',
    title: 'Gratis',
    priceLabel: 'gratis',
    summary: '1 artista, 6 faixas ativas e mais 18 guardadas',
    activeArtists: '1 artista ativo',
    activeTracks: '6 faixas ativas',
    totalTracks: '24 totais na conta',
  },
  {
    id: 'creator',
    title: 'Creator',
    priceLabel: 'US$4,99',
    summary: '2 artistas e ate 36 faixas por artista',
    activeArtists: '2 artistas ativos',
    activeTracks: '36 faixas por artista',
    totalTracks: '72 totais na conta',
  },
  {
    id: 'studio',
    title: 'Premium',
    priceLabel: 'US$14,99',
    summary: 'artistas ilimitados e acesso antecipado a Pulse e Lumen',
    activeArtists: 'artistas ilimitados',
    activeTracks: 'catalogo amplo por artista',
    totalTracks: 'beta antecipada em Pulse e Lumen',
  },
] as const;

export const creatorAccessChoices = [
  { id: 'standard', label: 'Original' },
  { id: 'kids', label: 'Kids' },
  { id: 'parody', label: 'Parodia' },
  { id: 'clone_inspired', label: 'Clone' },
  { id: 'explicit', label: '+18' },
  { id: 'restricted', label: 'Restrita' },
] as const;

export const languageChoices = ['pt-BR', 'en', 'es', 'instrumental'] as const;

export const qualityChoices = ['1', '2', '3', '4', '5'] as const;

export function buildReleaseDescription(input: {
  coauthors: string;
  composer: string;
  moment: string;
  language: string;
  hasLyrics: boolean;
  qualityScore: string;
  launchedElsewhere: boolean;
  coverSpec: string;
  audioSpec: string;
  previewCut: string;
  releaseWindow: 'now' | 'later';
  releaseDateLabel: string;
  launchMode: 'publish_now' | 'schedule' | 'circle_premiere';
}) {
  const lines = [
    input.coauthors.trim() ? `Coautoria: ${input.coauthors.trim()}` : '',
    input.composer.trim() ? `Compositor: ${input.composer.trim()}` : '',
    `Momento: ${input.moment}`,
    `Idioma: ${input.language}`,
    `Letra: ${input.hasLyrics ? 'sim' : 'nao'}`,
    `Qualidade declarada: ${input.qualityScore}/5`,
    `Lancada fora: ${input.launchedElsewhere ? 'sim' : 'nao'}`,
    `Capa: ${input.coverSpec}`,
    `Arquivo: ${input.audioSpec}`,
    `Recorte: ${input.previewCut}`,
    `Modo de lancamento: ${
      input.launchMode === 'publish_now'
        ? 'publicar agora'
        : input.launchMode === 'circle_premiere'
          ? 'estreia em circulo'
          : 'agendar'
    }`,
    `Janela: ${input.releaseWindow === 'now' ? 'agora' : input.releaseDateLabel}`,
  ].filter(Boolean);

  return lines.join('\n');
}

