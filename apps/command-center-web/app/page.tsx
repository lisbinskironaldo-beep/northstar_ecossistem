import { PageShell } from './components/page-shell';

export default function Home() {
  return (
    <PageShell
      title="Northstar Command Center"
      description="Founder-facing operational shell for the ecosystem. This surface will evolve into the command layer for launch clocks, trust alerts and platform health."
    >
      <ul>
        <li>Ecosystem health snapshot</li>
        <li>Echo launch clocks</li>
        <li>Trust and safety alerts</li>
      </ul>
    </PageShell>
  );
}
