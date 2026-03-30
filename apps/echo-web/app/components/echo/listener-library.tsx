'use client';

import { useMemo, useState } from 'react';
import { EchoCreator, FollowedCreatorEntry, SavedTrackEntry } from '../../lib/api';
import { getAccessRoomMeta } from '../../lib/access-rooms';
import {
  LibraryMemorySnapshot,
  PUBLIC_LIBRARY_FOLDERS,
  resolveBorrowedCreators,
  resolvePublicFolders,
  resolveSharedEntries,
} from '../../lib/library-memory';
import {
  ActionButton,
  Card,
  Grid,
  LinkButton,
  Pill,
  Stack,
  TabButton,
  helperTextStyle,
} from '../ui';

type LibraryTabId = 'private' | 'public' | 'shared';

const libraryTabs: Array<{ id: LibraryTabId; label: string; description: string }> = [
  { id: 'private', label: 'Private', description: 'Seu nucleo pessoal e offline.' },
  { id: 'public', label: 'Public', description: 'Colecoes visiveis e emprestadas.' },
  { id: 'shared', label: 'Shared', description: 'Espacos colaborativos e recorrentes.' },
];

export interface ListenerLibraryProps {
  savedTracks: SavedTrackEntry[];
  followedCreators: FollowedCreatorEntry[];
  creators: EchoCreator[];
  libraryMemory: LibraryMemorySnapshot;
  hiddenTrackCatalog: Record<string, string>;
  mutedCreatorCatalog: Record<string, string>;
  hiddenCategoryCatalog: Record<string, string>;
  deprioritizedCategoryCatalog: Record<string, string>;
  restoreHiddenTrack: (trackId: string) => void;
  restoreMutedCreator: (creatorId: string) => void;
  restoreHiddenCategory: (categoryId: string) => void;
  restoreDeprioritizedCategory: (categoryId: string) => void;
  clearAllExclusions: () => void;
  cycleTrackPublicFolder: (trackId: string) => void;
  toggleTrackOffline: (trackId: string) => void;
  toggleTrackShared: (trackId: string) => void;
  toggleBorrowedCreator: (creatorId: string) => void;
  publicUserId?: string;
}

export function ListenerLibrary({
  savedTracks,
  followedCreators,
  creators,
  libraryMemory,
  hiddenTrackCatalog,
  mutedCreatorCatalog,
  hiddenCategoryCatalog,
  deprioritizedCategoryCatalog,
  restoreHiddenTrack,
  restoreMutedCreator,
  restoreHiddenCategory,
  restoreDeprioritizedCategory,
  clearAllExclusions,
  cycleTrackPublicFolder,
  toggleTrackOffline,
  toggleTrackShared,
  toggleBorrowedCreator,
  publicUserId,
}: ListenerLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTabId>('private');

  const publicFolders = useMemo(
    () => resolvePublicFolders(savedTracks, libraryMemory),
    [libraryMemory, savedTracks],
  );
  const sharedRooms = useMemo(
    () => resolveSharedEntries(savedTracks, libraryMemory),
    [libraryMemory, savedTracks],
  );
  const borrowedCreators = useMemo(
    () => resolveBorrowedCreators(creators, libraryMemory),
    [creators, libraryMemory],
  );

  const offlineCount = libraryMemory.offlineTrackIds.length;
  const borrowedCount = borrowedCreators.length;
  const exclusionCount =
    Object.keys(hiddenTrackCatalog).length +
    Object.keys(mutedCreatorCatalog).length +
    Object.keys(hiddenCategoryCatalog).length +
    Object.keys(deprioritizedCategoryCatalog).length;

  return (
    <Stack gap={18}>
      <Card
        title="Library"
        subtitle="A biblioteca do Echo nao deve parecer so lista de saves. Ela precisa parecer gosto, colecao e retorno."
      >
        <Stack gap={14}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {libraryTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                label={tab.label}
                description={tab.description}
              />
            ))}
          </div>
          <Grid min={180}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{savedTracks.length}</div>
              <div style={{ color: '#8da3ca' }}>salvas</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{offlineCount}</div>
              <div style={{ color: '#8da3ca' }}>offline-ready</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{borrowedCount}</div>
              <div style={{ color: '#8da3ca' }}>emprestadas</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{exclusionCount}</div>
              <div style={{ color: '#8da3ca' }}>filtros vivos</div>
            </div>
          </Grid>
        </Stack>
      </Card>

      {activeTab === 'private' ? (
        <Grid min={320}>
          <Card
            title="Nucleo pessoal"
            subtitle="O que o listener guarda para repetir, baixar offline dentro do app e proteger do ruido."
          >
            <Stack gap={12}>
              {savedTracks.length === 0 ? (
                <p style={helperTextStyle}>
                  Ainda nao existem saves suficientes para a biblioteca ganhar forma.
                </p>
              ) : null}
              {savedTracks.slice(0, 5).map((entry) => {
                const publicFolder = libraryMemory.publicTrackFolderById[entry.content.id];
                const publicFolderLabel =
                  PUBLIC_LIBRARY_FOLDERS.find((folder) => folder.id === publicFolder)?.label ?? null;

                return (
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
                      <Pill label="Saved" tone="success" />
                      <Pill
                        label={
                          libraryMemory.offlineTrackIds.includes(entry.content.id)
                            ? 'Offline ligado'
                            : 'Offline pronto'
                        }
                        tone="accent"
                      />
                      <Pill
                        label={getAccessRoomMeta(entry.content.track?.accessRoom ?? 'standard').label}
                        tone={getAccessRoomMeta(entry.content.track?.accessRoom ?? 'standard').tone}
                      />
                      {publicFolderLabel ? <Pill label={publicFolderLabel} tone="default" /> : null}
                    </div>
                    <div style={{ fontWeight: 700 }}>{entry.content.title}</div>
                    <div style={{ marginTop: 4, color: '#c6d4ee' }}>
                      {entry.content.track?.artistNameDisplay ?? 'Unknown artist'}
                    </div>
                    <div style={{ marginTop: 4, color: '#8da3ca' }}>@{entry.content.creator.handle}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      <ActionButton
                        label={
                          libraryMemory.offlineTrackIds.includes(entry.content.id)
                            ? 'Desligar offline'
                            : 'Salvar offline'
                        }
                        tone="secondary"
                        onClick={() => toggleTrackOffline(entry.content.id)}
                      />
                      <ActionButton
                        label={publicFolderLabel ? `Publica: ${publicFolderLabel}` : 'Tornar publica'}
                        tone="secondary"
                        onClick={() => cycleTrackPublicFolder(entry.content.id)}
                      />
                      <ActionButton
                        label={
                          libraryMemory.sharedTrackIds.includes(entry.content.id)
                            ? 'Tirar do shared'
                            : 'Compartilhar'
                        }
                        tone="secondary"
                        onClick={() => toggleTrackShared(entry.content.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </Stack>
          </Card>

          <Card
            title="Taste memory"
            subtitle="O lugar mais importante para o Echo mostrar que esta aprendendo com suas rejeicoes."
          >
            <Stack gap={12}>
              {Object.keys(hiddenTrackCatalog).length === 0 &&
              Object.keys(mutedCreatorCatalog).length === 0 &&
              Object.keys(hiddenCategoryCatalog).length === 0 &&
              Object.keys(deprioritizedCategoryCatalog).length === 0 ? (
                <p style={helperTextStyle}>
                  Quando voce esconder, silenciar ou pedir menos de uma linha, tudo aparece aqui.
                </p>
              ) : null}

              {Object.entries(hiddenTrackCatalog).map(([trackId, label]) => (
                <div key={trackId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ color: '#dbe7ff' }}>{label}</div>
                  <ActionButton
                    label="Restaurar"
                    tone="secondary"
                    onClick={() => restoreHiddenTrack(trackId)}
                  />
                </div>
              ))}

              {Object.entries(mutedCreatorCatalog).map(([creatorId, label]) => (
                <div key={creatorId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ color: '#dbe7ff' }}>{label}</div>
                  <ActionButton
                    label="Reativar"
                    tone="secondary"
                    onClick={() => restoreMutedCreator(creatorId)}
                  />
                </div>
              ))}

              {Object.entries(hiddenCategoryCatalog).map(([categoryId, label]) => (
                <div key={categoryId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ color: '#dbe7ff' }}>Estilo oculto: {label}</div>
                  <ActionButton
                    label="Voltar"
                    tone="secondary"
                    onClick={() => restoreHiddenCategory(categoryId)}
                  />
                </div>
              ))}

              {Object.entries(deprioritizedCategoryCatalog).map(([categoryId, label]) => (
                <div key={categoryId} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ color: '#dbe7ff' }}>Menos disso: {label}</div>
                  <ActionButton
                    label="Normalizar"
                    tone="secondary"
                    onClick={() => restoreDeprioritizedCategory(categoryId)}
                  />
                </div>
              ))}

              {exclusionCount > 0 ? (
                <ActionButton label="Limpar tudo" tone="secondary" onClick={clearAllExclusions} />
              ) : null}
            </Stack>
          </Card>
        </Grid>
      ) : null}

      {activeTab === 'public' ? (
        <Grid min={320}>
          <Card
            title="Public library"
            subtitle="Colecoes que o listener escolhe mostrar no perfil como identidade musical."
          >
            <Stack gap={12}>
              {publicFolders.every((folder) => folder.entries.length === 0) ? (
                <p style={helperTextStyle}>
                  Quando o listener mover saves para as estantes publicas, essas pastas viram assinatura visivel.
                </p>
              ) : null}
              {publicFolders.map((folder) => (
                <div
                  key={folder.id}
                  style={{
                    border: '1px solid #1d3557',
                    borderRadius: 18,
                    padding: 16,
                    background: 'rgba(7, 17, 31, 0.82)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <Pill label="Publica" tone="accent" />
                    <Pill label={`${folder.entries.length} faixas`} tone="default" />
                  </div>
                  <div style={{ fontWeight: 700 }}>{folder.label}</div>
                  <div style={{ marginTop: 4, color: '#8da3ca' }}>{folder.note}</div>
                  {folder.entries.map((entry) => (
                    <div key={entry.id} style={{ marginTop: 8, color: '#c6d4ee' }}>
                      {entry.content.title} / {entry.content.track?.artistNameDisplay ?? 'Unknown artist'}
                    </div>
                  ))}
                  {publicUserId ? (
                    <div style={{ marginTop: 12 }}>
                      <LinkButton href={`/library/${publicUserId}`} label="Abrir biblioteca" />
                    </div>
                  ) : null}
                </div>
              ))}
            </Stack>
          </Card>

          <Card
            title="Borrowed shelves"
            subtitle="Colecoes pegas de bibliotecas publicas de outros perfis sem alterar a origem."
          >
            <Stack gap={12}>
              {followedCreators.length === 0 ? (
                <p style={helperTextStyle}>
                  Quando o listener seguir creators e outros perfis, as colecoes emprestadas entram aqui.
                </p>
              ) : null}
              {followedCreators.slice(0, 4).map((entry) => (
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
                    <Pill label="Emprestada" tone="warning" />
                    <Pill label="Somente leitura" tone="default" />
                    <Pill
                      label={
                        libraryMemory.borrowedCreatorIds.includes(entry.creator.id)
                          ? 'Na estante'
                          : 'Observando'
                      }
                      tone={
                        libraryMemory.borrowedCreatorIds.includes(entry.creator.id)
                          ? 'success'
                          : 'default'
                      }
                    />
                  </div>
                  <div style={{ fontWeight: 700 }}>{entry.creator.displayName}</div>
                  <div style={{ marginTop: 4, color: '#8da3ca' }}>@{entry.creator.handle}</div>
                  <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <ActionButton
                      label={
                        libraryMemory.borrowedCreatorIds.includes(entry.creator.id)
                          ? 'Remover da estante'
                          : 'Guardar na estante'
                      }
                      tone="secondary"
                      onClick={() => toggleBorrowedCreator(entry.creator.id)}
                    />
                    <LinkButton href={`/artist/${entry.creator.id}`} label="Ver artista" tone="secondary" />
                  </div>
                </div>
              ))}
            </Stack>
          </Card>
        </Grid>
      ) : null}

      {activeTab === 'shared' ? (
        <Grid min={320}>
          <Card
            title="Shared rooms"
            subtitle="Bibliotecas colaborativas para grupos, estudo, casais e repeticao leve."
          >
            <Stack gap={12}>
              {sharedRooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    border: '1px solid #1d3557',
                    borderRadius: 18,
                    padding: 16,
                    background: 'rgba(7, 17, 31, 0.82)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <Pill label="Compartilhada" tone="accent" />
                    <Pill label={`${room.entries.length} itens`} tone="default" />
                  </div>
                  <div style={{ fontWeight: 700 }}>{room.label}</div>
                  <div style={{ marginTop: 4, color: '#8da3ca' }}>{room.note}</div>
                  {room.entries.map((entry) => (
                    <div key={entry.id} style={{ marginTop: 8, color: '#c6d4ee' }}>
                      {entry.content.title} / {entry.content.track?.artistNameDisplay ?? 'Unknown artist'}
                    </div>
                  ))}
                </div>
              ))}
              <p style={helperTextStyle}>
                Essa camada saiu do desenho e ja virou memoria persistente: o listener decide o que
                quer manter em comum e o Echo lembra disso na proxima sessao.
              </p>
            </Stack>
          </Card>
        </Grid>
      ) : null}
    </Stack>
  );
}
