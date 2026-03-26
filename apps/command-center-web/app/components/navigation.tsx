const links = [
  { href: '/', label: 'Overview' },
  { href: '/echo', label: 'Echo Health' },
  { href: '/trust', label: 'Trust & Safety' },
  { href: '/media', label: 'Cost & Media' },
  { href: '/reviews', label: 'Review Clock' },
];

export function Navigation() {
  return (
    <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            padding: '8px 12px',
            border: '1px solid #d4d4d8',
            borderRadius: 999,
            textDecoration: 'none',
            color: '#111827',
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
