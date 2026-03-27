export function DemoSetupCard({
  apiBaseUrl,
  demoUserId,
  demoCreatorId,
  showCreator = false,
}: {
  apiBaseUrl: string;
  demoUserId?: string | null;
  demoCreatorId?: string | null;
  showCreator?: boolean;
}) {
  const userReady = Boolean(demoUserId);
  const creatorReady = Boolean(demoCreatorId);
  const fullyReady = showCreator ? userReady && creatorReady : userReady;

  return (
    <section
      style={{
        border: `1px solid ${fullyReady ? '#166534' : '#854d0e'}`,
        background: fullyReady ? 'rgba(22, 101, 52, 0.18)' : 'rgba(133, 77, 14, 0.18)',
        borderRadius: 20,
        padding: 18,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 10 }}>Demo Setup</h3>
      <p style={{ margin: '6px 0', color: '#b4c5e6' }}>API base: {apiBaseUrl}</p>
      <p style={{ margin: '6px 0', color: userReady ? '#bbf7d0' : '#fde68a' }}>
        Demo user: {demoUserId ?? 'missing NEXT_PUBLIC_DEMO_USER_ID'}
      </p>
      {showCreator ? (
        <p style={{ margin: '6px 0', color: creatorReady ? '#bbf7d0' : '#fde68a' }}>
          Demo creator: {demoCreatorId ?? 'missing NEXT_PUBLIC_DEMO_CREATOR_ID'}
        </p>
      ) : null}
      {!fullyReady ? (
        <div style={{ color: '#fde68a', lineHeight: 1.55 }}>
          <div>1. Start PostgreSQL and the API locally.</div>
          <div>2. Run `cmd /c npm run seed:echo:demo`.</div>
          <div>3. Copy the generated IDs into `.env`.</div>
          <div>4. Restart the Echo web preview.</div>
        </div>
      ) : (
        <p style={{ marginBottom: 0, color: '#bbf7d0' }}>
          Demo identities configured. This preview is ready for live local testing.
        </p>
      )}
    </section>
  );
}
