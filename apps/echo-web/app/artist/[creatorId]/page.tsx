'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Grid, LinkButton, Notice, PageShell, Pill, Stack, helperTextStyle } from '../../components/ui';
import { EchoCreator, EchoTrack, echoApi } from '../../lib/api';
import { getAccessRoomMeta } from '../../lib/access-rooms';

export default function PublicArtistPage() {
  const params = useParams<{ creatorId: string }>();
  const creatorId = params?.creatorId;
  const [creator, setCreator] = useState<EchoCreator | null>(null);
  const [tracks, setTracks] = useState<EchoTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorId) {
      return;
    }

    let active = true;

    async function load() {
      try {
        const [creatorData, trackData] = await Promise.all([
          echoApi.getCreatorProfile(creatorId),
          echoApi.getTracks({ creatorId, limit: 24 }),
        ]);

        if (!active) {
          return;
        }

        setCreator(creatorData);
        setTracks(trackData);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir o artista');
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [creatorId]);

  const visibleTracks = useMemo(
    () =>
      tracks.filter(
        (track) => track.visibilityState === 'visible' && (track.track?.accessRoom ?? 'standard') === 'standard',
      ),
    [tracks],
  );

  return (
    <PageShell
      title={creator?.displayName ?? 'Artist'}
      description="Pagina publica compartilhavel para descoberta externa. Ela deve abrir o Echo pelo artista, nao pelo painel."
    >
      <Stack gap={20}>
        {error ? <Notice title="Falha de carregamento" tone="danger">{error}</Notice> : null}

        {creator ? (
          <Grid min={320}>
            <Card title="Perfil" subtitle={`@${creator.handle}`}>
              <Stack gap={12}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Pill label={creator.creatorTier} tone="accent" />
                  <Pill label={`${creator.followerCountCached} seguidores`} tone="default" />
                  <Pill label={`${creator.publishedContentCountCached} faixas`} tone="success" />
                </div>
                {creator.bio ? <p style={helperTextStyle}>{creator.bio}</p> : null}
              </Stack>
            </Card>

            <Card title="Por que abrir este perfil" subtitle="Este e o tipo de superficie que ajuda o Echo a viajar para fora do proprio app.">
              <Stack gap={12}>
                <p style={helperTextStyle}>
                  O artista deve parecer descobrivel e compartilhavel antes de parecer enorme.
                </p>
                <p style={helperTextStyle}>
                  O foco aqui e curiosidade, identidade e retorno ao Echo.
                </p>
              </Stack>
            </Card>
          </Grid>
        ) : null}

        <Card title="Faixas em circulacao" subtitle="Somente o catalogo principal e visivel nesta pagina publica.">
          <Stack gap={12}>
            {visibleTracks.length === 0 ? (
              <p style={helperTextStyle}>Este artista ainda nao tem faixas publicas suficientes.</p>
            ) : null}
            {visibleTracks.map((track) => (
              <div
                key={track.id}
                style={{
                  border: '1px solid #1d3557',
                  borderRadius: 18,
                  padding: 16,
                  background: 'rgba(7, 17, 31, 0.82)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <Pill
                    label={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').label}
                    tone={getAccessRoomMeta(track.track?.accessRoom ?? 'standard').tone}
                  />
                  {track.primaryCategory ? <Pill label={track.primaryCategory.displayName} tone="default" /> : null}
                </div>
                <div style={{ fontWeight: 800 }}>{track.title}</div>
                <div style={{ marginTop: 4, color: '#8da3ca' }}>
                  {track.track?.artistNameDisplay ?? creator?.displayName ?? 'Unknown artist'}
                </div>
                <div style={{ marginTop: 10 }}>
                  <LinkButton href={`/track/${track.id}`} label="Abrir faixa" tone="secondary" />
                </div>
              </div>
            ))}
          </Stack>
        </Card>
      </Stack>
    </PageShell>
  );
}
