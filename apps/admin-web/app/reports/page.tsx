import { PageShell } from '../components/page-shell';
import { Card, DataTable, Pill } from '../components/ui';
import { getOpenReports } from '../lib/admin-api';

export const dynamic = 'force-dynamic';

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default async function ReportsPage() {
  const reports = await getOpenReports();

  return (
    <PageShell
      title="Reports Queue"
      description="Fila viva de reports abertos. Esta tela existe para deixar triagem, padrão de abuso e priorização claros para qualquer operador."
    >
      <Card
        title="Reports abertos"
        subtitle="Use o ID do report para aplicar ação moderativa na aba Moderation."
      >
        <DataTable
          headers={['Report', 'Alvo', 'Motivo', 'Origem', 'Status', 'Criado em']}
          rows={reports.map((report) => [
            <div key={`${report.id}-report`}>
              <div>{report.id}</div>
              <div style={{ color: '#8da3ca', fontSize: 12 }}>
                reporter: {report.reporterUserId ?? 'anonymous/system'}
              </div>
            </div>,
            report.contentId ?? report.creatorId ?? 'sem alvo',
            <Pill label={report.reportReason} tone="warning" />,
            report.reportSource,
            <Pill label={report.reportStatus} />,
            formatTimestamp(report.createdAt),
          ])}
        />
      </Card>
    </PageShell>
  );
}
