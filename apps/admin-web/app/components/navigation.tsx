const links = [
  { href: '/', label: 'Overview' },
  { href: '/reports', label: 'Reports Queue' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/actions', label: 'Moderation' },
];

export function Navigation() {
  return (
    <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          style={{
            padding: '10px 14px',
            border: '1px solid #26334d',
            borderRadius: 999,
            textDecoration: 'none',
            color: '#e5eefc',
            background: '#111827',
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
