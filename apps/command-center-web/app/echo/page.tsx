import { PageShell } from '../components/page-shell';

export default function EchoHealthPage() {
  return (
    <PageShell
      title="Echo Health"
      description="Initial placeholder for listener, creator and catalog health metrics in the Echo front."
    >
      <ul>
        <li>New and returning listeners</li>
        <li>New and active creators</li>
        <li>Upload and save volume</li>
      </ul>
    </PageShell>
  );
}
