import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { EchoCategory, EchoCreator, echoApi } from '../lib/api';
import {
  buildReleaseDescription,
  creatorAccessChoices,
  languageChoices,
  momentChoices,
  qualityChoices,
} from '../lib/mobile-experience';
import { ActionPill, GlassCard, SectionIntro, TinyStatus, palette } from './mobile-ui';

const previewMinuteChoices = ['00', '01', '02', '03'] as const;
const previewSecondChoices = ['00', '10', '20', '30', '40'] as const;
type StudioStepId = 'track' | 'classification' | 'launch';
type LaunchMode = 'publish_now' | 'schedule' | 'circle_premiere';

const studioSteps: Array<{ id: StudioStepId; title: string; note: string }> = [
  {
    id: 'track',
    title: 'Faixa',
    note: 'titulo, artista, capa, audio e preview',
  },
  {
    id: 'classification',
    title: 'Classificacao',
    note: 'categoria, idioma, mood e declaracoes',
  },
  {
    id: 'launch',
    title: 'Lancamento',
    note: 'publicar, agendar ou estrear em circulo',
  },
];

function getDefaultReleaseDateLabel() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function CreatorStudioPanel({
  enabled,
}: {
  enabled: boolean;
}) {
  const [activeStep, setActiveStep] = useState<StudioStepId>('track');
  const [creatorId, setCreatorId] = useState(echoApi.demoCreatorId ?? '');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupHandle, setSetupHandle] = useState('');
  const [setupBio, setSetupBio] = useState('');
  const [setupResultMessage, setSetupResultMessage] = useState<string | null>(null);
  const [creatingCreator, setCreatingCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [artistNameDisplay, setArtistNameDisplay] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [aiDeclaration, setAiDeclaration] = useState(true);
  const [accessRoom, setAccessRoom] = useState('standard');
  const [sourceToolOptional, setSourceToolOptional] = useState('');
  const [moment, setMoment] = useState<string>(momentChoices[0]);
  const [language, setLanguage] = useState<string>(languageChoices[0]);
  const [hasLyrics, setHasLyrics] = useState(true);
  const [qualityScore, setQualityScore] = useState<string>(qualityChoices[3]);
  const [launchedElsewhere, setLaunchedElsewhere] = useState(false);
  const [launchMode, setLaunchMode] = useState<LaunchMode>('schedule');
  const [releaseDateLabel, setReleaseDateLabel] = useState(getDefaultReleaseDateLabel());
  const [coverSpec, setCoverSpec] = useState('1:1 / jpg / ate 4 MB');
  const [audioSpec, setAudioSpec] = useState('wav ou mp3 / ate 50 MB');
  const [previewMinute, setPreviewMinute] = useState<(typeof previewMinuteChoices)[number]>('00');
  const [previewSecond, setPreviewSecond] = useState<(typeof previewSecondChoices)[number]>('20');
  const [coauthors, setCoauthors] = useState('');
  const [composer, setComposer] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [categories, setCategories] = useState<EchoCategory[]>([]);

  useEffect(() => {
    let active = true;

    async function loadMeta() {
      try {
        const [creatorData, categoryData] = await Promise.all([
          echoApi.getCreators(),
          echoApi.getCategories(),
        ]);

        if (!active) {
          return;
        }

        setCreators(creatorData);
        setCategories(categoryData);

        const resolvedCreator =
          creatorData.find((creator) => creator.id === echoApi.demoCreatorId) ?? creatorData[0];

        if (resolvedCreator) {
          setCreatorId((current: string) => current || resolvedCreator.id);
        }

        if (categoryData[0]) {
          setPrimaryCategoryId((current: string) => current || categoryData[0].id);
        }
      } catch (metaError) {
        if (active) {
          setResultMessage(
            metaError instanceof Error
              ? `Nao foi possivel carregar creators e categorias: ${metaError.message}`
              : 'Nao foi possivel carregar creators e categorias',
          );
        }
      } finally {
        if (active) {
          setLoadingMeta(false);
        }
      }
    }

    loadMeta();

    return () => {
      active = false;
    };
  }, []);

  const slotSummary = useMemo(
    () => [
      { label: 'Ativas', value: '6 por artista' },
      { label: 'Guardadas', value: '18 na conta gratis' },
      { label: 'Ativo na conta', value: '1 artista' },
    ],
    [],
  );
  const previewCut = useMemo(() => `${previewMinute}:${previewSecond} +20s`, [previewMinute, previewSecond]);
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === primaryCategoryId) ?? null,
    [categories, primaryCategoryId],
  );
  const releaseDateChoices = useMemo(
    () =>
      [7, 10, 14].map((days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }),
    [],
  );
  const launchModeLabel =
    launchMode === 'publish_now'
      ? 'Publicar agora'
      : launchMode === 'circle_premiere'
        ? 'Estreia em Circulo'
        : 'Agendar';
  const trackReady = Boolean(title.trim() && artistNameDisplay.trim() && coverSpec.trim() && audioSpec.trim());
  const classificationReady = Boolean(primaryCategoryId && language && moment && accessRoom);
  const launchReady = Boolean(launchMode === 'publish_now' || releaseDateLabel.trim());
  const stepCompletion: Record<StudioStepId, boolean> = {
    track: trackReady,
    classification: classificationReady,
    launch: launchReady,
  };
  const completionCount = Object.values(stepCompletion).filter(Boolean).length;
  const trackChecklist = [
    {
      label: 'Titulo pronto',
      done: Boolean(title.trim()),
      note: title.trim() ? 'a faixa ja tem nome de entrada' : 'defina o titulo que vai circular',
    },
    {
      label: 'Nome publico',
      done: Boolean(artistNameDisplay.trim()),
      note: artistNameDisplay.trim() ? 'o nome que aparece no feed esta definido' : 'preencha o nome publico do artista',
    },
    {
      label: 'Capa descrita',
      done: Boolean(coverSpec.trim()),
      note: coverSpec.trim() ? 'formato e peso registrados' : 'marque o formato da capa',
    },
    {
      label: 'Audio descrito',
      done: Boolean(audioSpec.trim()),
      note: audioSpec.trim() ? 'o arquivo ja esta pronto para subir' : 'marque o tipo e o peso do audio',
    },
  ];
  const classificationChecklist = [
    {
      label: 'Categoria ativa',
      done: Boolean(primaryCategoryId),
      note: primaryCategoryId ? 'a faixa ja tem prateleira principal' : 'escolha a categoria principal',
    },
    {
      label: 'Entrada definida',
      done: Boolean(accessRoom),
      note: accessRoom ? 'a faixa sabe onde entra no produto' : 'defina a entrada da faixa',
    },
    {
      label: 'Mood e idioma',
      done: Boolean(moment && language),
      note: moment && language ? `${moment} · ${language}` : 'feche mood e idioma antes de seguir',
    },
    {
      label: 'Declaracao de IA',
      done: aiDeclaration,
      note: aiDeclaration ? 'a faixa entra sinalizada corretamente' : 'ative a declaracao para manter o envio coerente',
    },
  ];
  const launchChecklist = [
    {
      label: 'Persona ativa',
      done: Boolean(creatorId),
      note: creatorId ? 'pronta para circular' : 'escolha um artista ativo',
    },
    {
      label: 'Faixa clara',
      done: trackReady,
      note: trackReady ? 'titulo, artista, capa e audio marcados' : 'preencha o bloco Faixa',
    },
    {
      label: 'Classificacao',
      done: classificationReady,
      note: classificationReady ? 'categoria, idioma e mood definidos' : 'falta fechar classificacao',
    },
    {
      label: 'Modo de lancamento',
      done: launchReady,
      note: launchMode === 'circle_premiere' ? 'vai entrar como evento no Aura' : launchModeLabel,
    },
  ];

  async function handleCreatorSetup() {
    if (!setupEmail.trim() || !setupDisplayName.trim() || !setupHandle.trim()) {
      setSetupResultMessage('Preencha email, nome artistico e handle.');
      return;
    }

    setCreatingCreator(true);
    setSetupResultMessage('Criando conta profissional...');

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
      setSetupResultMessage(`Perfil pronto: ${creator.displayName}`);
      setSetupEmail('');
      setSetupDisplayName('');
      setSetupHandle('');
      setSetupBio('');
    } catch (setupError) {
      setSetupResultMessage(
        setupError instanceof Error ? setupError.message : 'Nao foi possivel criar o perfil',
      );
    } finally {
      setCreatingCreator(false);
    }
  }

  async function handleSubmit() {
    if (!enabled) {
      setResultMessage('Aceite o plano gratis e os termos para continuar.');
      return;
    }

    if (!creatorId || !trackReady) {
      setResultMessage('Escolha uma persona ativa e feche titulo, nome publico, capa e audio antes de enviar.');
      setActiveStep('track');
      return;
    }

    if (!classificationReady) {
      setResultMessage('Feche categoria, idioma, mood e entrada antes de lancar.');
      setActiveStep('classification');
      return;
    }

    if (!launchReady) {
      setResultMessage('Defina como essa faixa vai entrar no Echo antes de publicar.');
      setActiveStep('launch');
      return;
    }

    setSubmitting(true);
    setResultMessage('Enviando faixa...');

    try {
      const releaseWindow = launchMode === 'publish_now' ? 'now' : 'later';
      const track = await echoApi.createTrack({
        creatorId,
        title: title.trim(),
        description: buildReleaseDescription({
          coauthors,
          composer,
          moment,
          language,
          hasLyrics,
          qualityScore,
          launchedElsewhere,
          coverSpec,
          audioSpec,
          previewCut,
          releaseWindow,
          releaseDateLabel,
          launchMode,
        }),
        primaryCategoryId: primaryCategoryId || undefined,
        artistNameDisplay: artistNameDisplay.trim(),
        accessRoom,
        aiDeclaration,
        sourceToolOptional: sourceToolOptional.trim() || undefined,
      });

      setTitle('');
      setArtistNameDisplay('');
      setSourceToolOptional('');
      setCoauthors('');
      setComposer('');
      setLaunchMode('schedule');
      setReleaseDateLabel(getDefaultReleaseDateLabel());
      setPreviewMinute('00');
      setPreviewSecond('20');
      setActiveStep('track');
      setResultMessage(`Faixa pronta no studio: ${track.title}`);
    } catch (submitError) {
      setResultMessage(
        submitError instanceof Error ? `Falha no envio: ${submitError.message}` : 'Falha no envio',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function goToPreviousStep() {
    const currentIndex = studioSteps.findIndex((step) => step.id === activeStep);
    const previousStep = studioSteps[currentIndex - 1];
    if (previousStep) {
      setActiveStep(previousStep.id);
    }
  }

  function goToNextStep() {
    if (activeStep === 'track' && !trackReady) {
      setResultMessage('Feche titulo, nome publico, capa e audio antes de seguir para Classificacao.');
      return;
    }

    if (activeStep === 'classification' && !classificationReady) {
      setResultMessage('Feche categoria, entrada, mood e idioma antes de seguir para Lancamento.');
      return;
    }

    const currentIndex = studioSteps.findIndex((step) => step.id === activeStep);
    const nextStep = studioSteps[currentIndex + 1];
    if (nextStep) {
      setResultMessage(null);
      setActiveStep(nextStep.id);
    }
  }

  if (loadingMeta) {
    return (
      <GlassCard tone="dark">
        <View style={{ alignItems: 'center', gap: 12 }}>
          <ActivityIndicator />
          <Text style={{ color: palette.mutedOnDark }}>Abrindo studio...</Text>
        </View>
      </GlassCard>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <GlassCard tone="dark">
        <SectionIntro
          title="Studio"
          caption="Fluxo curto para faixa, classificacao e lancamento. Ao vivo continua separado."
          tone="dark"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
          {slotSummary.map((slot) => (
            <TinyStatus key={slot.label} label={slot.label} value={slot.value} tone="dark" />
          ))}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro title="Conta profissional" caption="Crie a persona ou troque a ativa." tone="dark" />
        <View style={{ gap: 10 }}>
          <TextInput
            placeholder="Email do creator"
            placeholderTextColor={palette.mutedOnDark}
            value={setupEmail}
            onChangeText={setSetupEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
          />
          <TextInput
            placeholder="Nome artistico"
            placeholderTextColor={palette.mutedOnDark}
            value={setupDisplayName}
            onChangeText={setSetupDisplayName}
            style={inputStyle}
          />
          <TextInput
            placeholder="Handle"
            placeholderTextColor={palette.mutedOnDark}
            value={setupHandle}
            onChangeText={setSetupHandle}
            autoCapitalize="none"
            style={inputStyle}
          />
          <TextInput
            placeholder="Bio curta"
            placeholderTextColor={palette.mutedOnDark}
            value={setupBio}
            onChangeText={setSetupBio}
            style={[inputStyle, { minHeight: 70 }]}
            multiline
          />
          <Pressable
            onPress={handleCreatorSetup}
            disabled={creatingCreator}
            style={[ctaStyle, creatingCreator ? ctaDisabledStyle : null]}
          >
            <Text style={ctaTextStyle}>{creatingCreator ? 'Criando...' : 'Criar conta e perfil'}</Text>
          </Pressable>
          {setupResultMessage ? <Text style={helperTextStyle}>{setupResultMessage}</Text> : null}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro title="Persona ativa" caption="So uma fica ativa por vez no plano gratis." tone="dark" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {creators.map((creator) => (
            <ActionPill
              key={creator.id}
              label={creator.displayName}
              active={creator.id === creatorId}
              onPress={() => setCreatorId(creator.id)}
              tone="dark"
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard tone="dark">
        <SectionIntro
          title="Progresso do studio"
          caption={`${completionCount}/3 partes prontas. Tudo que nao for foco agora fica escondido na proxima etapa.`}
          tone="dark"
        />
        <View style={{ gap: 10 }}>
          {studioSteps.map((step, index) => {
            const active = step.id === activeStep;
            const done = stepCompletion[step.id];
            return (
              <Pressable
                key={step.id}
                onPress={() => setActiveStep(step.id)}
                style={{
                  padding: 14,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: active ? 'rgba(56,189,248,0.34)' : 'rgba(201,214,255,0.14)',
                  backgroundColor: active ? 'rgba(17,24,39,0.96)' : 'rgba(10,14,30,0.82)',
                  gap: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: done ? '#67d6a3' : active ? palette.neonBlue : 'rgba(139,92,246,0.6)',
                  }}
                />
                <Text style={{ color: palette.neonBlue, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                  etapa {index + 1}
                </Text>
                <Text style={{ color: palette.textOnDark, fontSize: 18, fontWeight: '700' }}>{step.title}</Text>
                <Text style={{ color: palette.mutedOnDark, lineHeight: 19 }}>{step.note}</Text>
                <Text style={{ color: done ? '#67d6a3' : palette.mutedOnDark, fontSize: 12, fontWeight: '700' }}>
                  {done ? 'pronta' : active ? 'em foco agora' : 'ainda aberta'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {activeStep === 'track' ? (
        <GlassCard tone="dark">
          <SectionIntro title="Faixa" caption="Entre so com o que faz a musica circular direito." tone="dark" />
          <View style={{ gap: 10 }}>
            <TextInput
              placeholder="Titulo"
              placeholderTextColor={palette.mutedOnDark}
              value={title}
              onChangeText={setTitle}
              style={inputStyle}
            />
            <TextInput
              placeholder="Nome publico do artista"
              placeholderTextColor={palette.mutedOnDark}
              value={artistNameDisplay}
              onChangeText={setArtistNameDisplay}
              style={inputStyle}
            />
            <TextInput
              placeholder="Capa: formato e tamanho"
              placeholderTextColor={palette.mutedOnDark}
              value={coverSpec}
              onChangeText={setCoverSpec}
              style={inputStyle}
            />
            <TextInput
              placeholder="Arquivo: tipo e tamanho"
              placeholderTextColor={palette.mutedOnDark}
              value={audioSpec}
              onChangeText={setAudioSpec}
              style={inputStyle}
            />

            <Text style={labelStyle}>Inicio do trecho de 20 segundos</Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {previewMinuteChoices.map((minute) => (
                  <ActionPill
                    key={minute}
                    label={`${minute} min`}
                    active={previewMinute === minute}
                    onPress={() => setPreviewMinute(minute)}
                    tone="dark"
                  />
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {previewSecondChoices.map((second) => (
                  <ActionPill
                    key={second}
                    label={`${second} s`}
                    active={previewSecond === second}
                    onPress={() => setPreviewSecond(second)}
                    tone="dark"
                  />
                ))}
              </View>
              <Text style={helperTextStyle}>Trecho selecionado: {previewCut}</Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={labelStyle}>Checklist da etapa</Text>
              {trackChecklist.map((item) => (
                <View
                  key={item.label}
                  style={{
                    padding: 12,
                    borderRadius: 18,
                    backgroundColor: item.done ? 'rgba(22,101,52,0.18)' : 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: item.done ? 'rgba(103,214,163,0.38)' : 'rgba(201,214,255,0.12)',
                    gap: 4,
                  }}
                >
                  <Text style={{ color: item.done ? '#86efac' : palette.textOnDark, fontWeight: '700' }}>{item.label}</Text>
                  <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{item.note}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>
      ) : null}

      {activeStep === 'classification' ? (
        <GlassCard tone="dark">
          <SectionIntro title="Classificacao" caption="O minimo para a faixa cair no lugar certo sem ruido." tone="dark" />
          <View style={{ gap: 10 }}>
            <TextInput
              placeholder="Ferramenta usada para criar"
              placeholderTextColor={palette.mutedOnDark}
              value={sourceToolOptional}
              onChangeText={setSourceToolOptional}
              style={inputStyle}
            />

            <Text style={labelStyle}>Categoria</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {categories.map((category) => (
                <ActionPill
                  key={category.id}
                  label={category.displayName}
                  active={category.id === primaryCategoryId}
                  onPress={() => setPrimaryCategoryId(category.id)}
                  tone="dark"
                />
              ))}
            </View>

            <Text style={labelStyle}>Entrada</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {creatorAccessChoices.map((choice) => (
                <ActionPill
                  key={choice.id}
                  label={choice.label}
                  active={choice.id === accessRoom}
                  onPress={() => setAccessRoom(choice.id)}
                  tone="dark"
                />
              ))}
            </View>

            <Text style={labelStyle}>Mood</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {momentChoices.map((choice) => (
                <ActionPill
                  key={choice}
                  label={choice}
                  active={choice === moment}
                  onPress={() => setMoment(choice)}
                  tone="dark"
                />
              ))}
            </View>

            <Text style={labelStyle}>Idioma</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {languageChoices.map((choice) => (
                <ActionPill
                  key={choice}
                  label={choice}
                  active={choice === language}
                  onPress={() => setLanguage(choice)}
                  tone="dark"
                />
              ))}
            </View>

            <Text style={labelStyle}>Qualidade declarada</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {qualityChoices.map((choice) => (
                <ActionPill
                  key={choice}
                  label={choice}
                  active={choice === qualityScore}
                  onPress={() => setQualityScore(choice)}
                  tone="dark"
                />
              ))}
            </View>

            <TextInput
              placeholder="Coautoria"
              placeholderTextColor={palette.mutedOnDark}
              value={coauthors}
              onChangeText={setCoauthors}
              style={inputStyle}
            />
            <TextInput
              placeholder="Compositor"
              placeholderTextColor={palette.mutedOnDark}
              value={composer}
              onChangeText={setComposer}
              style={inputStyle}
            />

            <View style={switchRowStyle}>
              <Text style={labelStyle}>Tem letra</Text>
              <Switch value={hasLyrics} onValueChange={setHasLyrics} />
            </View>
            <View style={switchRowStyle}>
              <Text style={labelStyle}>Declaracao de IA</Text>
              <Switch value={aiDeclaration} onValueChange={setAiDeclaration} />
            </View>
            <View style={switchRowStyle}>
              <Text style={labelStyle}>Ja saiu em outro lugar</Text>
              <Switch value={launchedElsewhere} onValueChange={setLaunchedElsewhere} />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={labelStyle}>Checklist da etapa</Text>
              {classificationChecklist.map((item) => (
                <View
                  key={item.label}
                  style={{
                    padding: 12,
                    borderRadius: 18,
                    backgroundColor: item.done ? 'rgba(22,101,52,0.18)' : 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: item.done ? 'rgba(103,214,163,0.38)' : 'rgba(201,214,255,0.12)',
                    gap: 4,
                  }}
                >
                  <Text style={{ color: item.done ? '#86efac' : palette.textOnDark, fontWeight: '700' }}>{item.label}</Text>
                  <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{item.note}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>
      ) : null}

      {activeStep === 'launch' ? (
        <GlassCard tone="dark">
          <SectionIntro title="Lancamento" caption="Escolha como essa faixa vai entrar no Echo e veja o card antes de subir." tone="dark" />
          <View style={{ gap: 10 }}>
            <Text style={labelStyle}>Modo de lancamento</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <ActionPill
                label="Publicar agora"
                active={launchMode === 'publish_now'}
                onPress={() => setLaunchMode('publish_now')}
                tone="dark"
              />
              <ActionPill
                label="Agendar"
                active={launchMode === 'schedule'}
                onPress={() => setLaunchMode('schedule')}
                tone="dark"
              />
              <ActionPill
                label="Estreia em Circulo"
                active={launchMode === 'circle_premiere'}
                onPress={() => setLaunchMode('circle_premiere')}
                tone="dark"
              />
            </View>

            {launchMode !== 'publish_now' ? (
              <View style={{ gap: 10 }}>
                <Text style={labelStyle}>
                  {launchMode === 'circle_premiere' ? 'Janela da estreia' : 'Agenda do lancamento'}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {releaseDateChoices.map((label) => (
                    <ActionPill
                      key={label}
                      label={label}
                      active={releaseDateLabel === label}
                      onPress={() => setReleaseDateLabel(label)}
                      tone="dark"
                    />
                  ))}
                </View>
              </View>
            ) : null}

            <View style={{ gap: 8 }}>
              <Text style={labelStyle}>Checklist de completude</Text>
              {launchChecklist.map((item) => (
                <View
                  key={item.label}
                  style={{
                    padding: 12,
                    borderRadius: 18,
                    backgroundColor: item.done ? 'rgba(22,101,52,0.18)' : 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: item.done ? 'rgba(103,214,163,0.38)' : 'rgba(201,214,255,0.12)',
                    gap: 4,
                  }}
                >
                  <Text style={{ color: item.done ? '#86efac' : palette.textOnDark, fontWeight: '700' }}>{item.label}</Text>
                  <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{item.note}</Text>
                </View>
              ))}
            </View>

            <View style={{ gap: 8 }}>
              <Text style={labelStyle}>Preview do card</Text>
              <View
                style={{
                  padding: 16,
                  borderRadius: 22,
                  backgroundColor: 'rgba(10,14,30,0.88)',
                  borderWidth: 1,
                  borderColor: launchMode === 'circle_premiere' ? 'rgba(255,92,168,0.38)' : 'rgba(56,189,248,0.34)',
                  gap: 6,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: launchMode === 'circle_premiere' ? '#ff5ca8' : '#37b8ff',
                  }}
                />
                <Text style={{ color: launchMode === 'circle_premiere' ? '#ff8cbe' : palette.neonBlue, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                  {launchModeLabel}
                </Text>
                <Text style={{ color: palette.textOnDark, fontSize: 20, fontWeight: '800' }}>
                  {title.trim() || 'Sua faixa aparece aqui'}
                </Text>
                <Text style={{ color: palette.mutedOnDark }}>
                  {(artistNameDisplay.trim() || 'Nome publico do artista')} · {selectedCategory?.displayName ?? 'Categoria'}
                </Text>
                <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>
                  {launchMode === 'circle_premiere'
                    ? `${releaseDateLabel} · entra no Aura antes de liberar inteira`
                    : launchMode === 'publish_now'
                      ? 'entra no feed normal sem esperar janela'
                      : `${releaseDateLabel} · agenda o momento sem virar evento`}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting || !enabled}
              style={[ctaStyle, submitting || !enabled ? ctaDisabledStyle : null]}
            >
              <Text style={ctaTextStyle}>{submitting ? 'Enviando...' : 'Subir faixa'}</Text>
            </Pressable>
            {resultMessage ? <Text style={helperTextStyle}>{resultMessage}</Text> : null}
          </View>
        </GlassCard>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={goToPreviousStep}
          disabled={activeStep === 'track'}
          style={[ghostButtonStyle, activeStep === 'track' ? ghostButtonDisabledStyle : null]}
        >
          <Text style={ghostButtonTextStyle}>Voltar etapa</Text>
        </Pressable>
        <Pressable
          onPress={goToNextStep}
          disabled={activeStep === 'launch'}
          style={[ghostButtonStyle, activeStep === 'launch' ? ghostButtonDisabledStyle : null]}
        >
          <Text style={ghostButtonTextStyle}>
            {activeStep === 'track'
              ? 'Ir para Classificacao'
              : activeStep === 'classification'
                ? 'Ir para Lancamento'
                : 'Proxima etapa'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: 'rgba(201,214,255,0.14)',
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: 'rgba(255,255,255,0.06)',
  color: palette.textOnDark,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: '700' as const,
  color: palette.textOnDark,
};

const switchRowStyle = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
};

const ctaStyle = {
  backgroundColor: palette.neonBlue,
  paddingVertical: 16,
  borderRadius: 18,
  alignItems: 'center' as const,
};

const ctaDisabledStyle = {
  backgroundColor: '#475569',
};

const ctaTextStyle = {
  color: '#08101d',
  fontWeight: '800' as const,
};

const ghostButtonStyle = {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 18,
  alignItems: 'center' as const,
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(201,214,255,0.14)',
};

const ghostButtonDisabledStyle = {
  opacity: 0.45,
};

const ghostButtonTextStyle = {
  color: palette.textOnDark,
  fontWeight: '700' as const,
};

const helperTextStyle = {
  color: palette.mutedOnDark,
  lineHeight: 20,
};

