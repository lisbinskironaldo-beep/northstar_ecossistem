import type { ReactNode } from 'react';
import { Navigation } from './navigation';

export function PageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main style={{ padding: 32, fontFamily: 'system-ui', color: '#111827' }}>
      <Navigation />
      <h1>{title}</h1>
      <p style={{ maxWidth: 720 }}>{description}</p>
      <section style={{ marginTop: 24 }}>{children}</section>
    </main>
  );
}
