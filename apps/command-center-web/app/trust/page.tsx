import { PageShell } from '../components/page-shell';

export default function TrustPage() {
  return (
    <PageShell
      title="Trust & Safety"
      description="Initial trust and fraud monitoring shell for reports, suspicious spikes and moderation signals."
    >
      <ul>
        <li>Report spikes</li>
        <li>Duplicate-content alerts</li>
        <li>Low-trust creator watchlist</li>
      </ul>
    </PageShell>
  );
}
