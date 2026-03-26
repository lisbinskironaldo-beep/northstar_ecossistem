import { createModerationAction } from './moderation';
import { PageShell } from '../components/page-shell';
import { Card, DataTable, Pill } from '../components/ui';
import { getOpenReports, getRecentModerationActions } from '../lib/admin-api';

export const dynamic = 'force-dynamic';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'sem prazo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

function renderStatus(status?: string) {
  if (status === 'success') {
    return <Pill label="Ação registrada" tone="success" />;
  }

  if (status === 'failed') {
    return <Pill label="Falha no envio" tone="danger" />;
  }

  if (status === 'missing-fields') {
    return <Pill label="Campos obrigatórios faltando" tone="warning" />;
  }

  return null;
}

export default async function ActionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const status = (await searchParams)?.status;
  const [reports, actions] = await Promise.all([
    getOpenReports(),
    getRecentModerationActions(20),
  ]);

  return (
    <PageShell
      title="Moderation"
      description="Área operacional para registrar ação moderativa diretamente no backend e manter histórico explícito do que foi feito."
    >
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'minmax(320px, 420px) minmax(420px, 1fr)',
        }}
      >
        <Card
          title="Nova ação"
          subtitle="Use o report ID quando a ação vier de uma denúncia específica."
        >
          <div style={{ marginBottom: 16 }}>{renderStatus(status)}</div>
          <form action={createModerationAction} style={{ display: 'grid', gap: 12 }}>
            <label>
              <div style={{ marginBottom: 6 }}>Report ID</div>
              <input name="reportId" style={inputStyle} />
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Target type</div>
              <select name="targetType" style={inputStyle} defaultValue="content">
                <option value="content">content</option>
                <option value="creator">creator</option>
                <option value="user">user</option>
              </select>
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Target ID</div>
              <input name="targetId" style={inputStyle} required />
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Action type</div>
              <select name="actionType" style={inputStyle} defaultValue="reduce_reach">
                <option value="reduce_reach">reduce_reach</option>
                <option value="limit_upload">limit_upload</option>
                <option value="archive_content">archive_content</option>
                <option value="remove_content">remove_content</option>
                <option value="suspend_user">suspend_user</option>
                <option value="ban_user">ban_user</option>
              </select>
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Action reason</div>
              <textarea name="actionReason" rows={4} style={inputStyle} required />
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Created by</div>
              <input name="createdBy" defaultValue="founder" style={inputStyle} />
            </label>
            <label>
              <div style={{ marginBottom: 6 }}>Expires at (optional ISO)</div>
              <input
                name="expiresAt"
                placeholder="2026-04-15T12:00:00.000Z"
                style={inputStyle}
              />
            </label>
            <button
              type="submit"
              style={{
                ...inputStyle,
                cursor: 'pointer',
                fontWeight: 700,
                background: '#0f62fe',
                color: '#f8fbff',
                border: '1px solid #0f62fe',
              }}
            >
              Registrar ação
            </button>
          </form>
        </Card>

        <Card
          title="Fila e histórico"
          subtitle="Leitura rápida dos reports abertos e das últimas respostas moderativas."
        >
          <h3 style={{ marginTop: 0 }}>Reports abertos</h3>
          <DataTable
            headers={['Report', 'Alvo', 'Motivo']}
            rows={reports.slice(0, 8).map((report) => [
              report.id,
              report.contentId ?? report.creatorId ?? 'sem alvo',
              <Pill key={`${report.id}-reason`} label={report.reportReason} tone="warning" />,
            ])}
          />

          <h3 style={{ marginTop: 24 }}>Ações recentes</h3>
          <DataTable
            headers={['Tipo', 'Alvo', 'Motivo', 'Quando']}
            rows={actions.map((action) => [
              <Pill
                key={`${action.id}-type`}
                label={action.actionType}
                tone={
                  action.actionType === 'remove_content' || action.actionType === 'ban_user'
                    ? 'danger'
                    : 'warning'
                }
              />,
              action.targetId,
              action.actionReason,
              formatTimestamp(action.createdAt),
            ])}
          />
        </Card>
      </div>
    </PageShell>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 12,
  border: '1px solid #294472',
  background: '#081120',
  color: '#e5eefc',
};
