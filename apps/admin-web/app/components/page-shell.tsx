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
    <main
      style={{
        minHeight: '100vh',
        padding: 32,
        fontFamily: 'system-ui',
        color: '#e5eefc',
        background:
          'radial-gradient(circle at top, rgba(40,83,168,0.34), transparent 30%), #07111f',
      }}
    >
      <Navigation />
      <h1 style={{ marginBottom: 12 }}>{title}</h1>
      <p style={{ maxWidth: 780, color: '#a7b7d6' }}>{description}</p>
      <section style={{ marginTop: 24 }}>{children}</section>
    </main>
  );
}
