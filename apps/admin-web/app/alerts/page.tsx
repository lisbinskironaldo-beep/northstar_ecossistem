import { PageShell } from '../components/page-shell';
import { Card, DataTable, Pill } from '../components/ui';
import { getRecentAlerts } from '../lib/admin-api';

export const dynamic = 'force-dynamic';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'pendente';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}

export default async function AlertsPage() {
  const alerts = await getRecentAlerts(30);

  return (
    <PageShell
      title="Alerts"
      description="Sinais automáticos emitidos pela base de trust para acelerar resposta antes que lixo, fraude ou abuso cresçam."
    >
      <Card
        title="Alertas recentes"
        subtitle="Severidade alta deve virar decisão explícita. Severidade warning pede confirmação de padrão."
      >
        <DataTable
          headers={['Alvo', 'Tipo', 'Severidade', 'Disparo', 'Resolução']}
          rows={alerts.map((alert) => [
            alert.targetReference,
            alert.alertType,
            <Pill
              label={alert.severity}
              tone={alert.severity === 'high' || alert.severity === 'critical' ? 'danger' : 'warning'}
            />,
            formatTimestamp(alert.triggeredAt),
            formatTimestamp(alert.resolvedAt),
          ])}
        />
      </Card>
    </PageShell>
  );
}
