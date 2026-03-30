'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  Grid,
  LinkButton,
  Notice,
  PageShell,
  Pill,
  Stack,
  helperTextStyle,
} from '../../components/ui';
import { EchoTrack, echoApi } from '../../lib/api';
import { getAccessRoomMeta } from '../../lib/access-rooms';

export default function PublicTrackPage() {
  const params = useParams<{ trackId: string }>();
  const trackId = params?.trackId;
  const [track, setTrack] = useState<EchoTrack | null>(null);
  const [creatorTracks, setCreatorTracks] = useState<EchoTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackId) {
      return;
    }

    let active = true;

    async function load() {
      try {
        const trackData = await echoApi.getTrack(trackId);

        if (!active) {
          return;
        }

        setTrack(trackData);

        const related = await echoApi.getTracks({
          creatorId: trackData.creator.id,
          limit: 12,
        });

        if (!active) {
          return;
        }

        setCreatorTracks(related);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir a faixa');
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [trackId]);

  const openingTracks = useMemo(
    () =>
      creatorTracks.filter(
        (entry) =>
          entry.id !== track?.id &&
          entry.visibilityState === 'visible' &&
          (entry.track?.accessRoom ?? 'standard') === 'standard',
      ),
    [creatorTracks, track?.id],
  );

  return (
    <PageShell
      title={track?.title ?? 'Track'}
      description="Pagina publica leve para a musica viajar fora do Echo sem depender de uma tela pesada de app."
    >
      <Stack gap={20}>
        {error ? <Notice title="Falha de carregamento" tone="danger">{error}</Notice> : null}

        {track ? (
          <Grid min={320}>
            <Card title="Faixa" subtitle={`@${track.creator.handle}`}>
              <Stack gap={12}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Pill
                    label={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').label}
                    tone={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').tone}
                  />
                  {track.primaryCategory ? (
                    <Pill label={track.primaryCategory.displayName} tone="default" />
                  ) : null}
                  <Pill label={track.contentState} tone="accent" />
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
                  {track.title}
                </div>
                <div style={{ color: '#dbe7ff', fontSize: 18 }}>
                  {track.track?.artistNameDisplay ?? track.creator.displayName}
                </div>
                <div style={{ color: '#8da3ca' }}>publicado por @{track.creator.handle}</div>
                {track.description ? <p style={helperTextStyle}>{track.description}</p> : null}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <LinkButton href={`/artist/${track.creator.id}`} label="Perfil do artista" />
                  {echoApi.demoUserId ? (
                    <LinkButton href={`/library/${echoApi.demoUserId}`} label="Biblioteca publica" tone="secondary" />
                  ) : null}
                </div>
              </Stack>
            </Card>

            <Card
              title="Por que esta pagina existe"
              subtitle="A faixa tambem precisa viajar sozinha, nao apenas por artista ou biblioteca."
            >
              <Stack gap={12}>
                <p style={helperTextStyle}>
                  Esta superficie ajuda o Echo a circular por links diretos, sem depender de feed caro
                  ou de uma home pesada para toda descoberta.
                </p>
                <p style={helperTextStyle}>
                  O ideal aqui e curiosidade, clique rapido e retorno para o ecossistema.
                </p>
              </Stack>
            </Card>
          </Grid>
        ) : null}

        <Card
          title="Mais deste artista"
          subtitle="Somente as faixas visiveis do room principal aparecem nesta camada publica."
        >
          <Stack gap={12}>
            {openingTracks.length === 0 ? (
              <p style={helperTextStyle}>
                Ainda nao ha outras faixas principais suficientes para abrir uma trilha publica forte.
              </p>
            ) : null}
            {openingTracks.slice(0, 6).map((entry) => (
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
                  {entry.primaryCategory ? (
                    <Pill label={entry.primaryCategory.displayName} tone="default" />
                  ) : null}
                  <Pill
                    label={getAccessRoomMeta(entry.track?.accessRoom ?? 'standard').label}
                    tone={getAccessRoomMeta(entry.track?.accessRoom ?? 'standard').tone}
                  />
                </div>
                <div style={{ fontWeight: 800 }}>{entry.title}</div>
                <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                  {entry.track?.artistNameDisplay ?? entry.creator.displayName}
                </div>
                <div style={{ marginTop: 10 }}>
                  <LinkButton href={`/track/${entry.id}`} label="Abrir faixa" tone="secondary" />
                </div>
              </div>
            ))}
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
