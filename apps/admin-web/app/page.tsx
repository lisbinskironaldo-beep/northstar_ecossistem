import { PageShell } from './components/page-shell';
import { Card, DataTable, Pill, StatCard, StatGrid } from './components/ui';
import { getAdminOverview } from './lib/admin-api';

export const dynamic = 'force-dynamic';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'pending';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default async function Home() {
  const overview = await getAdminOverview();

  return (
    <PageShell
      title="Northstar Admin"
      description="Superfície operacional para acompanhar Echo, risco de conteúdo, fila de reports e resposta moderativa sem depender do histórico do chat."
    >
      <StatGrid>
        <StatCard label="Usuários" value={overview.echoOverview.totals.users} />
        <StatCard label="Criadores Echo" value={overview.echoOverview.totals.creators} />
        <StatCard label="Faixas Echo" value={overview.echoOverview.totals.tracks} />
        <StatCard label="Saves" value={overview.echoOverview.totals.saves} />
        <StatCard label="Playbacks" value={overview.echoOverview.totals.playbacks} />
        <StatCard label="Eventos" value={overview.echoOverview.totals.events} />
        <StatCard
          label="Reports abertos"
          value={overview.openReports.length}
          tone={overview.openReports.length >= 5 ? 'danger' : 'warning'}
        />
        <StatCard
          label="Alertas recentes"
          value={overview.recentAlerts.length}
          tone={overview.recentAlerts.some((alert) => alert.severity === 'high') ? 'danger' : 'default'}
        />
      </StatGrid>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          marginTop: 20,
        }}
      >
        <Card
          title="Fila quente"
          subtitle="O que pede ação rápida do fundador ou de outro operador nas próximas horas."
        >
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>{overview.openReports.length} reports abertos aguardando triagem.</li>
            <li>{overview.recentAlerts.length} alertas recentes emitidos pelo trust baseline.</li>
            <li>{overview.recentActions.length} ações moderativas recentes já registradas.</li>
          </ul>
        </Card>
        <Card
          title="Leitura executiva"
          subtitle="Resumo curto para orientar a próxima decisão sem abrir mil telas."
        >
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Echo já tem ingest, analytics e trust conectados no backend.</li>
            <li>O admin agora consegue ver reports, alertas, eventos e aplicar ação manual.</li>
            <li>O próximo ganho estrutural é validar tudo contra Postgres local ponta a ponta.</li>
          </ul>
        </Card>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          marginTop: 20,
        }}
      >
        <Card title="Reports abertos" subtitle="Amostra da fila de trust aberta agora.">
          <DataTable
            headers={['Target', 'Motivo', 'Origem', 'Criado em']}
            rows={overview.openReports.slice(0, 6).map((report) => [
              <div key={`${report.id}-target`}>
                <div>{report.contentId ?? report.creatorId ?? 'sem alvo'}</div>
                <div style={{ color: '#8da3ca', fontSize: 12 }}>{report.id}</div>
              </div>,
              <Pill key={`${report.id}-reason`} label={report.reportReason} tone="warning" />,
              report.reportSource,
              formatTimestamp(report.createdAt),
            ])}
          />
        </Card>

        <Card title="Alertas recentes" subtitle="Sinais automáticos que exigem leitura rápida.">
          <DataTable
            headers={['Alvo', 'Tipo', 'Severidade', 'Disparado em']}
            rows={overview.recentAlerts.map((alert) => [
              alert.targetReference,
              alert.alertType,
              <Pill
                key={`${alert.id}-severity`}
                label={alert.severity}
                tone={alert.severity === 'high' ? 'danger' : 'warning'}
              />,
              formatTimestamp(alert.triggeredAt),
            ])}
          />
        </Card>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          marginTop: 20,
        }}
      >
        <Card title="Eventos recentes" subtitle="Pulso operacional do Echo capturado pelo analytics baseline.">
          <DataTable
            headers={['Evento', 'Ator', 'Conteúdo', 'Quando']}
            rows={overview.recentEvents.map((event) => [
              event.eventName,
              event.actorCreatorId ?? event.actorUserId ?? 'system',
              event.contentId ?? 'n/a',
              formatTimestamp(event.occurredAtUtc),
            ])}
          />
        </Card>

        <Card title="Ações moderativas" subtitle="Últimas respostas aplicadas pelo sistema ou operador.">
          <DataTable
            headers={['Tipo', 'Alvo', 'Responsável', 'Quando']}
            rows={overview.recentActions.map((action) => [
              <Pill
                key={`${action.id}-action`}
                label={action.actionType}
                tone={
                  action.actionType === 'remove_content' || action.actionType === 'ban_user'
                    ? 'danger'
                    : 'warning'
                }
              />,
              action.targetId,
              action.createdBy ?? 'system',
              formatTimestamp(action.createdAt),
            ])}
          />
        </Card>
      </div>
    </PageShell>
  );
}
