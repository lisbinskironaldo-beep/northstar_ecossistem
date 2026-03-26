import { PageShell } from '../components/page-shell';

export default function MediaPage() {
  return (
    <PageShell
      title="Cost & Media"
      description="Initial cost and media diagnostics shell for storage growth, processing failures and burn baseline."
    >
      <ul>
        <li>Storage growth</li>
        <li>Processing failures</li>
        <li>Estimated monthly burn baseline</li>
      </ul>
    </PageShell>
  );
}
