import type { ReactNode } from 'react';

export const metadata = {
  title: 'Northstar Admin',
  description: 'Operational admin surface for Northstar Ecosystem.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: '#07111f' }}>{children}</body>
    </html>
  );
}
