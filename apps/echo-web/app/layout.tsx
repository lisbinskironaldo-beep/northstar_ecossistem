import type { ReactNode } from 'react';

export const metadata = {
  title: 'Echo Web',
  description: 'Stable browser preview for the Echo product loop.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: '#06111f',
          color: '#e6eefc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
