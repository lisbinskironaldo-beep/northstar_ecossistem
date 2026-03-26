import { PageShell } from '../components/page-shell';

export default function ReviewsPage() {
  return (
    <PageShell
      title="Review Clock"
      description="Initial shell for release and launch review checkpoints across the ecosystem."
    >
      <ul>
        <li>T-72h readiness review</li>
        <li>T+24h health review</li>
        <li>T+30d retention review</li>
      </ul>
    </PageShell>
  );
}
