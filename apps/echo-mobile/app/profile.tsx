import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { EchoCreator, EchoTrack, FollowedCreatorEntry, SavedTrackEntry, echoApi } from '../src/lib/api';
import { creatorPlans } from '../src/lib/mobile-experience';
import {
  buildProfileNumbers,
  resolveProfileLevel,
} from '../src/lib/profile-progress';
import { CreatorStudioPanel } from '../src/components/creator-studio-panel';
import { CreatorLivePanel } from '../src/components/creator-live-panel';
import type { useEchoCommunityState } from '../src/lib/use-echo-community-state';
import { GlassCard, ModeSwitch, ScreenScroll, TinyStatus, palette } from '../src/components/mobile-ui';

const CREATOR_ACCEPTED_KEY = 'echo-mobile-creator-accepted-v1';
const CREATOR_PLAN_KEY = 'echo-mobile-creator-plan-v1';

export default function ProfileScreen({
  mode,
  onModeChange,
  community,
}: {
  mode: 'listener' | 'creator';
  onModeChange: (mode: 'listener' | 'creator') => void;
  community: ReturnType<typeof useEchoCommunityState>;
}) {
  const [savedTracks, setSavedTracks] = useState<SavedTrackEntry[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreatorEntry[]>([]);
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gateHydrated, setGateHydrated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof creatorPlans)[number]['id']>('free');
  const [creatorAccepted, setCreatorAccepted] = useState(false);
  const [showArtistManager, setShowArtistManager] = useState(false);
  const [paymentTargetPlan, setPaymentTargetPlan] = useState<(typeof creatorPlans)[number] | null>(null);
  const [managerTab, setManagerTab] = useState<'studio' | 'live'>('studio');
  const [selectedCreatorId, setSelectedCreatorId] = useState(echoApi.demoCreatorId ?? '');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const [savedData, followedData, trackData, creatorData, storedAccepted, storedPlan] = await Promise.all([
          echoApi.getSavedTracks().catch(() => []),
          echoApi.getFollowedCreators().catch(() => []),
          echoApi.getTracks().catch(() => []),
          echoApi.getCreators().catch(() => []),
          AsyncStorage.getItem(CREATOR_ACCEPTED_KEY),
          AsyncStorage.getItem(CREATOR_PLAN_KEY),
        ]);

        if (!active) {
          return;
        }

        setSavedTracks(savedData);
        setFollowedCreators(followedData);
        setTracks(trackData);
        setCreators(creatorData);
        setCreatorAccepted(storedAccepted === 'accepted');
        if (storedPlan && creatorPlans.some((plan) => plan.id === storedPlan)) {
          setSelectedPlan(storedPlan as (typeof creatorPlans)[number]['id']);
        }
        setSelectedCreatorId(echoApi.demoCreatorId ?? creatorData[0]?.id ?? trackData[0]?.creator.id ?? '');
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir o perfil');
        }
      } finally {
        if (active) {
          setLoading(false);
          setGateHydrated(true);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const profileNumbers = useMemo(
    () =>
      buildProfileNumbers({
        tracks: tracks.filter((track) => track.creator.id === echoApi.demoCreatorId),
        savedTracks,
        followedCreators,
        community,
      }),
    [community, followedCreators, savedTracks, tracks],
  );
  const profileLevel = useMemo(() => resolveProfileLevel(profileNumbers), [profileNumbers]);
  const selectedPlanMeta = useMemo(
    () => creatorPlans.find((plan) => plan.id === selectedPlan) ?? creatorPlans[0],
    [selectedPlan],
  );

  async function handlePlanSelect(planId: (typeof creatorPlans)[number]['id']) {
    const targetPlan = creatorPlans.find((plan) => plan.id === planId) ?? creatorPlans[0];

    if (targetPlan.id !== 'free') {
      setPaymentTargetPlan(targetPlan);
      return;
    }

    setSelectedPlan(planId);
    try {
      await AsyncStorage.setItem(CREATOR_PLAN_KEY, planId);
    } catch {}
  }

  async function confirmPaymentPlan() {
    if (!paymentTargetPlan) {
      return;
    }

    setSelectedPlan(paymentTargetPlan.id);
    try {
      await AsyncStorage.setItem(CREATOR_PLAN_KEY, paymentTargetPlan.id);
    } catch {}
    setPaymentTargetPlan(null);
  }

  async function handleCreatorAccept() {
    setCreatorAccepted(true);
    try {
      await AsyncStorage.setItem(CREATOR_ACCEPTED_KEY, 'accepted');
    } catch {}
  }

  if (loading || !gateHydrated) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator />
          <Text style={{ color: palette.mutedOnDark }}>Abrindo perfil...</Text>
        </View>
      );
  }

  return (
    <ScreenScroll tone="dark">
      <ModeSwitch mode={mode} onChange={onModeChange} />

      {error ? (
        <GlassCard tone="danger">
          <Text style={{ color: '#881337', fontWeight: '700' }}>Perfil incompleto</Text>
          <Text style={{ color: '#9f1239' }}>{error}</Text>
        </GlassCard>
      ) : null}

      {mode === 'listener' ? (
        <View style={{ gap: 14 }}>
          <GlassCard tone="dark">
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ gap: 6, flex: 1 }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: palette.textOnDark }}>Seu pulso</Text>
                  <Text style={{ color: palette.mutedOnDark, lineHeight: 20 }}>Seu gosto, seu acervo e seu nivel em um lugar so.</Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 18,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(201,214,255,0.14)',
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
                      backgroundColor: '#97dbb3',
                    }}
                  />
                  <Text style={{ color: palette.textOnDark, fontWeight: '700' }}>
                    {profileLevel.title} · {profileLevel.tierLabel}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                <ProfileMetric label="Publicadas" value={String(profileNumbers.publishedTracks)} />
                <ProfileMetric label="Seguindo" value={String(profileNumbers.followingCount)} />
                <ProfileMetric label="Biblioteca" value={String(profileNumbers.libraryCount)} />
                <ProfileMetric label="Favoritas" value={String(profileNumbers.favoritesCount)} />
                <ProfileMetric label="Seguidores" value={String(profileNumbers.followerCount)} />
                <ProfileMetric label="Nivel" value={profileLevel.tierLabel} />
              </View>

              <View
                style={{
                  padding: 14,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(201,214,255,0.14)',
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
                    backgroundColor: '#9fd6ff',
                  }}
                />
                <Text style={{ color: palette.textOnDark, fontWeight: '700', marginBottom: 4 }}>
                  Como subir de nivel
                </Text>
                <Text style={{ color: palette.mutedOnDark, lineHeight: 20 }}>{profileLevel.note}</Text>
              </View>
            </View>
          </GlassCard>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ProfileRailButton
              icon="⦸"
              title="Excluidos"
              note="bloqueios e escondidos"
            />
            <ProfileRailButton
              icon="⚙"
              title="Config"
              note="senha, email e conta"
            />
          </View>
        </View>
      ) : null}

      {mode === 'creator' ? (
        <View style={{ gap: 16 }}>
          {!showArtistManager ? (
            <>
              <GlassCard tone="dark">
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: palette.textOnDark }}>Planos</Text>
                  <View style={{ gap: 10 }}>
                    {creatorPlans.map((plan) => (
                      <Pressable
                        key={plan.id}
                        onPress={() => handlePlanSelect(plan.id)}
                        style={{
                          padding: 16,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: plan.id === selectedPlan ? 'rgba(56,189,248,0.36)' : 'rgba(201,214,255,0.14)',
                          backgroundColor: plan.id === selectedPlan ? 'rgba(17,24,39,0.98)' : 'rgba(255,255,255,0.06)',
                          gap: 8,
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
                            backgroundColor: plan.id === selectedPlan ? '#97dbb3' : '#9fd6ff',
                          }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: plan.id === selectedPlan ? '#f8fafc' : palette.textOnDark,
                              fontWeight: '700',
                              fontSize: 18,
                            }}
                          >
                            {plan.title}
                          </Text>
                          <Text
                            style={{
                              color: plan.id === selectedPlan ? '#cbd5e1' : palette.mutedOnDark,
                              fontWeight: '700',
                            }}
                          >
                            {plan.priceLabel}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: plan.id === selectedPlan ? '#e2e8f0' : palette.mutedOnDark,
                            lineHeight: 20,
                          }}
                        >
                          {plan.summary}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </GlassCard>

              {paymentTargetPlan ? (
                <GlassCard tone="dark">
                  <View style={{ gap: 10 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#f8fafc' }}>
                      Pagamento
                    </Text>
                    <Text style={{ color: '#cbd5e1', lineHeight: 20 }}>
                      O plano {paymentTargetPlan.title} pede checkout antes da troca. Esta superficie ja abre a
                      etapa certa; a conexao com o gateway entra depois.
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                      <TinyStatus label="Plano" value={paymentTargetPlan.title} tone="dark" />
                      <TinyStatus label="Valor" value={paymentTargetPlan.priceLabel} tone="dark" />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Pressable onPress={confirmPaymentPlan} style={creatorAcceptStyle}>
                        <Text style={{ color: '#0f172a', fontWeight: '800' }}>Ir para pagamento</Text>
                      </Pressable>
                      <Pressable onPress={() => setPaymentTargetPlan(null)} style={darkGhostButtonStyle}>
                        <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Fechar</Text>
                      </Pressable>
                    </View>
                  </View>
                </GlassCard>
              ) : null}

              <GlassCard tone={creatorAccepted ? 'ok' : 'dark'}>
                <View style={{ gap: 10 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '700',
                      color: creatorAccepted ? palette.text : '#f8fafc',
                    }}
                  >
                    {creatorAccepted ? 'Aceite registrado' : 'Liberar modo profissional'}
                  </Text>
                  <Text
                    style={{
                      color: creatorAccepted ? palette.muted : '#cbd5e1',
                      lineHeight: 20,
                    }}
                  >
                    Sem monetizacao por agora. O autor responde por direitos, autoria e riscos da propria
                    publicacao. Documento ou selfie podem ser pedidos em revisao editorial, suspeita de abuso
                    ou futura distribuicao externa.
                  </Text>
                  {!creatorAccepted ? (
                    <Pressable onPress={handleCreatorAccept} style={creatorAcceptStyle}>
                      <Text style={{ color: '#0f172a', fontWeight: '800' }}>Aceitar e liberar studio</Text>
                    </Pressable>
                  ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                      <TinyStatus label="Estado" value="travado contra edicao" tone="dark" />
                      <TinyStatus label="Validacao" value="sob demanda" tone="dark" />
                      <TinyStatus label="Empresa" value="fila pronta" tone="dark" />
                    </View>
                  )}
                </View>
              </GlassCard>

              <GlassCard tone="dark">
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: palette.textOnDark }}>Seu plano</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                    <TinyStatus label="Plano" value={selectedPlanMeta.title} tone="dark" />
                    <TinyStatus label="Ativos" value={selectedPlanMeta.activeTracks} tone="dark" />
                    <TinyStatus label="Artistas" value={selectedPlanMeta.activeArtists} tone="dark" />
                    <TinyStatus label="Total" value={selectedPlanMeta.totalTracks} tone="dark" />
                  </View>
                  <Text style={{ color: palette.mutedOnDark, lineHeight: 20 }}>
                    {selectedPlanMeta.title === 'Gratis'
                      ? 'No gratis voce gira 1 artista por vez, com 6 faixas ativas e espaco guardado para testar trocas.'
                      : selectedPlanMeta.summary}
                  </Text>
                </View>
              </GlassCard>

              <Pressable
                onPress={() => {
                  setManagerTab('studio');
                  setShowArtistManager(true);
                }}
                disabled={!creatorAccepted}
                style={[
                  managerButtonStyle,
                  !creatorAccepted ? { backgroundColor: '#94a3b8' } : null,
                ]}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '800', fontSize: 16 }}>Gerenciar artistas</Text>
              </Pressable>
            </>
          ) : (
            <View style={{ gap: 12 }}>
              <Pressable onPress={() => setShowArtistManager(false)} style={backButtonStyle}>
                <Text style={{ color: palette.textOnDark, fontWeight: '700' }}>Voltar aos planos</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={() => setManagerTab('studio')}
                  style={[managerToggleStyle, managerTab === 'studio' ? managerToggleActiveStyle : null]}
                >
                  <Text style={managerTab === 'studio' ? managerToggleActiveTextStyle : managerToggleTextStyle}>
                    Studio
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setManagerTab('live')}
                  style={[managerToggleStyle, managerTab === 'live' ? managerToggleActiveStyle : null]}
                >
                  <Text style={managerTab === 'live' ? managerToggleActiveTextStyle : managerToggleTextStyle}>
                    Ao vivo
                  </Text>
                </Pressable>
              </View>
              {managerTab === 'studio' ? <CreatorStudioPanel enabled={creatorAccepted} /> : null}
              {managerTab === 'live' ? (
                <CreatorLivePanel
                  enabled={creatorAccepted}
                  creators={creators}
                  creatorId={selectedCreatorId}
                  onSelectCreator={setSelectedCreatorId}
                  livePlansByCreatorId={community.livePlansByCreatorId}
                  onAddLivePlan={community.addLivePlan}
                />
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </ScreenScroll>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        width: '47%',
        minWidth: 140,
        padding: 14,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(201,214,255,0.14)',
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
          backgroundColor: '#9fd6ff',
        }}
      />
      <Text style={{ color: palette.mutedOnDark, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text style={{ color: palette.textOnDark, fontSize: 20, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

function ProfileRailButton({
  icon,
  title,
  note,
}: {
  icon: string;
  title: string;
  note: string;
}) {
  return (
    <Pressable
      style={{
        flex: 1,
        minHeight: 72,
        paddingHorizontal: 16,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(201,214,255,0.14)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
          backgroundColor: '#97dbb3',
        }}
      />
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: palette.textOnDark }}>{icon}</Text>
      </View>
      <View style={{ gap: 2, flex: 1 }}>
        <Text style={{ color: palette.textOnDark, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: palette.mutedOnDark, fontSize: 12 }}>{note}</Text>
      </View>
    </Pressable>
  );
}

const creatorAcceptStyle = {
  marginTop: 4,
  backgroundColor: '#f8fafc',
  paddingVertical: 15,
  paddingHorizontal: 18,
  borderRadius: 6,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  alignItems: 'center' as const,
};

const managerButtonStyle = {
  backgroundColor: 'rgba(17,24,39,0.98)',
  paddingVertical: 16,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: 'rgba(56,189,248,0.28)',
  alignItems: 'center' as const,
};

const backButtonStyle = {
  alignSelf: 'flex-start' as const,
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  borderColor: 'rgba(201,214,255,0.14)',
};

const darkGhostButtonStyle = {
  paddingHorizontal: 18,
  paddingVertical: 15,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: '#334155',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const managerToggleStyle = {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(201,214,255,0.14)',
  alignItems: 'center' as const,
};

const managerToggleActiveStyle = {
  backgroundColor: '#0f172a',
  borderColor: '#0f172a',
};

const managerToggleTextStyle = {
  color: palette.textOnDark,
  fontWeight: '700' as const,
};

const managerToggleActiveTextStyle = {
  color: '#f8fafc',
  fontWeight: '700' as const,
};
