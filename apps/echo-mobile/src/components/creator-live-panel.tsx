import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { EchoCreator } from '../lib/api';
import type { EchoLivePlan } from '../lib/use-echo-community-state';
import { ActionPill, GlassCard, SectionIntro, palette } from './mobile-ui';

function buildLiveDefaultNote(daysFromNow = 1) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const day = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
  return `${day} · 21:30 · audio ao vivo · sem arquivo`;
}

export function CreatorLivePanel({
  enabled,
  creators,
  creatorId,
  onSelectCreator,
  livePlansByCreatorId,
  onAddLivePlan,
}: {
  enabled: boolean;
  creators: EchoCreator[];
  creatorId: string;
  onSelectCreator: (creatorId: string) => void;
  livePlansByCreatorId: Record<string, EchoLivePlan[]>;
  onAddLivePlan: (creatorId: string, plan: Omit<EchoLivePlan, 'id'>) => Promise<void>;
}) {
  const [liveTitle, setLiveTitle] = useState('Aura de estreia');
  const [liveNote, setLiveNote] = useState(buildLiveDefaultNote(1));
  const [liveMode, setLiveMode] = useState<'radio' | 'show' | 'drop'>('radio');
  const [message, setMessage] = useState<string | null>(null);

  const activeLivePlans = useMemo(() => (creatorId ? livePlansByCreatorId[creatorId] ?? [] : []), [creatorId, livePlansByCreatorId]);

  async function handleAddLivePlan() {
    if (!creatorId) {
      setMessage('Escolha uma persona antes de montar a agenda.');
      return;
    }

    if (!enabled) {
      setMessage('Liberte o studio antes de agendar o ao vivo.');
      return;
    }

    if (!liveTitle.trim() || !liveNote.trim()) {
      setMessage('Preencha o titulo e a janela da sessao.');
      return;
    }

    await onAddLivePlan(creatorId, {
      title: liveTitle.trim(),
      note: liveNote.trim(),
      mode: liveMode,
    });

    setMessage(`Agenda pronta: ${liveTitle.trim()}`);
  }

  return (
    <View style={{ gap: 16 }}>
      <GlassCard tone="soft">
        <SectionIntro
          title="Ao vivo"
          caption="Radio, show e drop vivem aqui, separados da subida de faixa."
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {creators.map((creator) => (
            <ActionPill
              key={creator.id}
              label={creator.displayName}
              active={creator.id === creatorId}
              onPress={() => onSelectCreator(creator.id)}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard>
        <View style={{ gap: 10 }}>
          <TextInput
            placeholder="Titulo da sessao"
            value={liveTitle}
            onChangeText={setLiveTitle}
            style={inputStyle}
          />
          <TextInput
            placeholder="Dia, hora e nota curta"
            value={liveNote}
            onChangeText={setLiveNote}
            style={inputStyle}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[
              { id: 'radio', label: 'Radio' },
              { id: 'show', label: 'Show' },
              { id: 'drop', label: 'Drop' },
            ].map((item) => (
              <ActionPill
                key={item.id}
                label={item.label}
                active={item.id === liveMode}
                onPress={() => setLiveMode(item.id as 'radio' | 'show' | 'drop')}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <ActionPill label="amanha 21:30" onPress={() => setLiveNote(buildLiveDefaultNote(1))} tone="soft" />
            <ActionPill label="+3 dias 20:00" onPress={() => setLiveNote(buildLiveDefaultNote(3).replace('21:30', '20:00'))} tone="soft" />
            <ActionPill label="+7 dias 22:00" onPress={() => setLiveNote(buildLiveDefaultNote(7).replace('21:30', '22:00'))} tone="soft" />
          </View>
          <Pressable onPress={handleAddLivePlan} disabled={!enabled} style={[ctaStyle, !enabled ? ctaDisabledStyle : null]}>
            <Text style={ctaTextStyle}>Agendar ao vivo</Text>
          </Pressable>
          {message ? <Text style={helperTextStyle}>{message}</Text> : null}
        </View>
      </GlassCard>

      <GlassCard tone="soft">
        <SectionIntro title="Agenda" caption="Aparece no perfil do artista e depois pode subir para a home." />
        <View style={{ gap: 8 }}>
          {activeLivePlans.map((plan) => (
            <View
              key={plan.id}
              style={{
                padding: 12,
                borderRadius: 6,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: 'rgba(255,255,255,0.78)',
                borderWidth: 1,
                borderColor: '#d7deea',
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
                  backgroundColor: '#97dbb3',
                }}
              />
              <Text style={{ color: palette.text, fontWeight: '700' }}>{plan.title}</Text>
              <Text style={{ color: palette.muted }}>{plan.note}</Text>
            </View>
          ))}
          {activeLivePlans.length === 0 ? (
            <Text style={{ color: palette.muted }}>Ainda sem agenda. A primeira sessao ao vivo nasce aqui.</Text>
          ) : null}
        </View>
      </GlassCard>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#d7deea',
  borderRadius: 4,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: 'rgba(255,255,255,0.82)',
};

const ctaStyle = {
  backgroundColor: palette.accent,
  paddingVertical: 16,
  borderRadius: 4,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  alignItems: 'center' as const,
};

const ctaDisabledStyle = {
  backgroundColor: '#94a3b8',
};

const ctaTextStyle = {
  color: '#f8fafc',
  fontWeight: '700' as const,
};

const helperTextStyle = {
  color: palette.muted,
  lineHeight: 20,
};
