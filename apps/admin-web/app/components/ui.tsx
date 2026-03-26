import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <article
      style={{
        border: '1px solid #1d3557',
        borderRadius: 20,
        padding: 20,
        background: 'rgba(10, 19, 35, 0.85)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 20 }}>{title}</h2>
      {subtitle ? (
        <p style={{ marginTop: 0, color: '#9cb0d1', fontSize: 14 }}>{subtitle}</p>
      ) : null}
      {children}
    </article>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const borderColor =
    tone === 'danger'
      ? '#7f1d1d'
      : tone === 'warning'
        ? '#854d0e'
        : tone === 'success'
          ? '#166534'
          : '#1d3557';

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 18,
        padding: 18,
        background: 'rgba(7, 17, 31, 0.85)',
      }}
    >
      <div style={{ color: '#8da3ca', fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 12,
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  textAlign: 'left',
                  padding: '12px 10px',
                  color: '#8da3ca',
                  borderBottom: '1px solid #1d3557',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  style={{
                    padding: '12px 10px',
                    borderBottom: '1px solid rgba(29, 53, 87, 0.65)',
                    verticalAlign: 'top',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pill({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const colors =
    tone === 'danger'
      ? { border: '#7f1d1d', text: '#fecaca', background: 'rgba(127, 29, 29, 0.24)' }
      : tone === 'warning'
        ? { border: '#854d0e', text: '#fde68a', background: 'rgba(133, 77, 14, 0.24)' }
        : tone === 'success'
          ? { border: '#166534', text: '#bbf7d0', background: 'rgba(22, 101, 52, 0.24)' }
          : { border: '#1d3557', text: '#d8e4fb', background: 'rgba(29, 53, 87, 0.24)' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1px solid ${colors.border}`,
        color: colors.text,
        background: colors.background,
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
      }}
    >
      {label}
    </span>
  );
}
