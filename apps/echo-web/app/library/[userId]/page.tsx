'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Grid, LinkButton, Notice, PageShell, Pill, Stack, helperTextStyle } from '../../components/ui';
import { SavedTrackEntry, echoApi } from '../../lib/api';
import { LibraryMemorySnapshot, createEmptyLibraryMemory, loadLibraryMemory, resolvePublicFolders } from '../../lib/library-memory';

export default function PublicLibraryPage() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;
  const [savedTracks, setSavedTracks] = useState<SavedTrackEntry[]>([]);
  const [libraryMemory, setLibraryMemory] = useState<LibraryMemorySnapshot>(() =>
    createEmptyLibraryMemory(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLibraryMemory(loadLibraryMemory());
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    async function load() {
      try {
        const saves = await echoApi.getSavedTracks(userId);
        if (!active) {
          return;
        }
        setSavedTracks(saves);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir a biblioteca');
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [userId]);

  const folders = useMemo(() => resolvePublicFolders(savedTracks, libraryMemory), [libraryMemory, savedTracks]);

  return (
    <PageShell
      title="Public library"
      description="Pagina compartilhavel para gosto, colecao e descoberta. Ela deve trazer gente nova para dentro do Echo."
    >
      <Stack gap={20}>
        {error ? <Notice title="Falha de carregamento" tone="danger">{error}</Notice> : null}

        <Grid min={240}>
          <Card title="Camada publica" subtitle="Nao e historico bruto. E gosto editavel e compartilhavel.">
            <Stack gap={10}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Pill label={`${savedTracks.length} faixas`} tone="accent" />
                <Pill
                  label={`${folders.filter((folder) => folder.entries.length > 0).length} pastas`}
                  tone="success"
                />
              </div>
              <p style={helperTextStyle}>
                Bibliotecas publicas ajudam o Echo a se espalhar sem depender de feed viral caro.
              </p>
            </Stack>
          </Card>

          <Card title="Como isso cresce" subtitle="Biblioteca compartilhada e um atalho natural para trazer gente nova.">
            <Stack gap={10}>
              <p style={helperTextStyle}>Salvar, organizar e compartilhar deve ser parte do produto, nao um detalhe.</p>
            </Stack>
          </Card>
        </Grid>

        <Grid min={320}>
          {folders.every((folder) => folder.entries.length === 0) ? (
            <Card title="Sem colecoes" subtitle="Ainda nao ha saves suficientes para uma biblioteca publica forte.">
              <p style={helperTextStyle}>
                Quando o listener organizar faixas nas estantes publicas, a biblioteca comeca a ter cara propria.
              </p>
            </Card>
          ) : null}

          {folders.filter((folder) => folder.entries.length > 0).map((folder) => (
            <Card key={folder.label} title={folder.label} subtitle={`${folder.entries.length} faixas`}>
              <Stack gap={10}>
                <p style={helperTextStyle}>{folder.note}</p>
                {folder.entries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      border: '1px solid #1d3557',
                      borderRadius: 18,
                      padding: 16,
                      background: 'rgba(7, 17, 31, 0.82)',
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{entry.content.title}</div>
                    <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                      {entry.content.track?.artistNameDisplay ?? 'Unknown artist'}
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{entry.content.creator.handle}</div>
                    <div style={{ marginTop: 10 }}>
                      <LinkButton href={`/track/${entry.content.id}`} label="Abrir faixa" tone="secondary" />
                    </div>
                  </div>
                ))}
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </PageShell>
  );
}
