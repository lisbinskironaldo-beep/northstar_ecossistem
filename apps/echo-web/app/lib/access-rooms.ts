export type AccessRoomId =
  | 'standard'
  | 'kids'
  | 'parody'
  | 'clone'
  | 'explicit'
  | 'restricted';

export const ACCESS_ROOMS: Array<{
  id: AccessRoomId;
  label: string;
  tone: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  note: string;
}> = [
  { id: 'standard', label: 'Main', tone: 'success', note: 'Fluxo normal do Echo.' },
  { id: 'kids', label: 'Kids', tone: 'accent', note: 'Sala separada para infantil.' },
  { id: 'parody', label: 'Parody', tone: 'warning', note: 'Fora do feed padrao.' },
  { id: 'clone', label: 'Clone-inspired', tone: 'danger', note: 'Exige rotulo explicito.' },
  { id: 'explicit', label: 'Explicit', tone: 'danger', note: 'Nao roda por padrao.' },
  { id: 'restricted', label: 'Restricted', tone: 'warning', note: 'Entrada protegida.' },
];

export function getAccessRoomMeta(accessRoom: string) {
  return ACCESS_ROOMS.find((room) => room.id === accessRoom) ?? ACCESS_ROOMS[0];
}
