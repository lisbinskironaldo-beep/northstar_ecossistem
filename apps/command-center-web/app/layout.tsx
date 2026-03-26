import type { ReactNode } from 'react';

export const metadata = {
  title: 'Northstar Command Center',
  description: 'Founder-facing operational dashboard for Northstar Ecosystem.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
