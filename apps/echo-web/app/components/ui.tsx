import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

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
        padding: 28,
        background:
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.28), transparent 22%), radial-gradient(circle at top right, rgba(20, 184, 166, 0.16), transparent 18%), linear-gradient(180deg, #04101d 0%, #07111f 42%, #050d18 100%)',
      }}
    >
      <header
        style={{
          marginBottom: 28,
          padding: 28,
          borderRadius: 30,
          border: '1px solid rgba(37, 99, 235, 0.22)',
          background:
            'linear-gradient(135deg, rgba(9, 19, 36, 0.96), rgba(8, 18, 34, 0.82))',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.24)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.18), transparent 24%), radial-gradient(circle at 80% 30%, rgba(45, 212, 191, 0.14), transparent 18%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(96, 165, 250, 0.22)',
              background: 'rgba(8, 18, 34, 0.75)',
              color: '#9dd7ff',
              fontSize: 13,
            }}
          >
            Echo preview
          </div>
          <h1 style={{ marginBottom: 10, marginTop: 18, fontSize: 44, letterSpacing: -1.4 }}>
            {title}
          </h1>
          <p style={{ maxWidth: 860, color: '#a5b6d7', lineHeight: 1.7, fontSize: 16 }}>
            {description}
          </p>
        </div>
      </header>
      {children}
    </main>
  );
}

export function Card({
  title,
  subtitle,
  children,
  accent,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <section
      style={{
        border: `1px solid ${accent ?? '#1d3557'}`,
        borderRadius: 24,
        padding: 20,
        background: 'linear-gradient(180deg, rgba(8, 18, 34, 0.88), rgba(6, 14, 26, 0.82))',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>{title}</h2>
      {subtitle ? <p style={{ marginTop: 0, color: '#9cb0d1' }}>{subtitle}</p> : null}
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div
      style={{
        border: '1px solid rgba(59, 130, 246, 0.22)',
        borderRadius: 20,
        padding: 18,
        background:
          'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(7, 17, 31, 0.9)), radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 34%)',
      }}
    >
      <div style={{ color: '#8da3ca', fontSize: 13, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{value}</div>
      {note ? <div style={{ marginTop: 8, color: '#b7c8e8', fontSize: 13 }}>{note}</div> : null}
    </div>
  );
}

export function Notice({
  title,
  children,
  tone = 'info',
}: {
  title: string;
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}) {
  const palette =
    tone === 'success'
      ? { border: '#166534', background: 'rgba(22, 101, 52, 0.18)', color: '#bbf7d0' }
      : tone === 'warning'
        ? { border: '#854d0e', background: 'rgba(133, 77, 14, 0.18)', color: '#fde68a' }
        : tone === 'danger'
          ? { border: '#991b1b', background: 'rgba(127, 29, 29, 0.2)', color: '#fecaca' }
          : { border: '#1d4ed8', background: 'rgba(29, 78, 216, 0.16)', color: '#bfdbfe' };

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 20,
        padding: 16,
        background: palette.background,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: palette.color }}>{title}</div>
      <div style={{ color: '#d9e7ff', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

export function Pill({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}) {
  const styles =
    tone === 'success'
      ? { border: '#166534', background: 'rgba(22, 101, 52, 0.18)', color: '#bbf7d0' }
      : tone === 'warning'
        ? { border: '#854d0e', background: 'rgba(133, 77, 14, 0.18)', color: '#fde68a' }
        : tone === 'danger'
          ? { border: '#991b1b', background: 'rgba(127, 29, 29, 0.22)', color: '#fecaca' }
          : tone === 'accent'
            ? { border: '#1d4ed8', background: 'rgba(29, 78, 216, 0.18)', color: '#bfdbfe' }
            : { border: '#334155', background: 'rgba(51, 65, 85, 0.18)', color: '#cbd5e1' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '6px 10px',
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

export function TabButton({
  active,
  onClick,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 999,
        padding: '12px 18px',
        border: `1px solid ${active ? '#3b82f6' : '#1d3557'}`,
        background: active
          ? 'linear-gradient(135deg, #2563eb, #0f172a)'
          : 'linear-gradient(180deg, rgba(8, 18, 34, 0.92), rgba(7, 17, 31, 0.84))',
        color: '#eef4ff',
        fontWeight: 700,
        boxShadow: active ? '0 14px 30px rgba(37, 99, 235, 0.22)' : 'none',
        display: 'grid',
        gap: 4,
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      {description ? (
        <span style={{ fontSize: 12, fontWeight: 500, color: active ? '#dbeafe' : '#8da3ca' }}>
          {description}
        </span>
      ) : null}
    </button>
  );
}

export function ActionButton({
  label,
  onClick,
  tone = 'default',
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  tone?: 'default' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const styles =
    tone === 'danger'
      ? { background: '#7f1d1d', border: '#991b1b' }
      : tone === 'secondary'
        ? { background: '#334155', border: '#475569' }
        : { background: '#111827', border: '#1f2937' };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 999,
        padding: '10px 14px',
        border: `1px solid ${styles.border}`,
        background: disabled ? '#64748b' : styles.background,
        color: '#f8fafc',
        fontWeight: 700,
        boxShadow: disabled ? 'none' : '0 10px 24px rgba(0, 0, 0, 0.18)',
      }}
    >
      {label}
    </button>
  );
}

export function LinkButton({
  href,
  label,
  tone = 'default',
}: {
  href: string;
  label: string;
  tone?: 'default' | 'secondary' | 'danger';
}) {
  const styles =
    tone === 'danger'
      ? { background: '#7f1d1d', border: '#991b1b' }
      : tone === 'secondary'
        ? { background: '#334155', border: '#475569' }
        : { background: '#111827', border: '#1f2937' };

  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        padding: '10px 14px',
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: '#f8fafc',
        fontWeight: 700,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  );
}

export function Chip({
  selected,
  label,
  onClick,
}: {
  selected?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 999,
        padding: '9px 13px',
        border: `1px solid ${selected ? '#2563eb' : '#334155'}`,
        background: selected ? '#111827' : 'transparent',
        color: selected ? '#f8fafc' : '#cbd5e1',
      }}
    >
      {label}
    </button>
  );
}

export function Stack({
  gap = 16,
  children,
  style,
}: {
  gap?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <div style={{ display: 'grid', gap, ...style }}>{children}</div>;
}

export function Grid({
  children,
  min = 280,
}: {
  children: ReactNode;
  min?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 18,
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  );
}

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 14,
  border: '1px solid #334155',
  background: 'rgba(8, 18, 34, 0.95)',
  color: '#eef4ff',
  padding: '12px 14px',
  font: 'inherit',
};

export const textAreaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 96,
  resize: 'vertical',
};

export const helperTextStyle: CSSProperties = {
  color: '#8da3ca',
  margin: 0,
  lineHeight: 1.6,
};
