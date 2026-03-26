type EchoOverviewResponse = {
  surface: 'echo';
  totals: {
    users: number;
    creators: number;
    tracks: number;
    saves: number;
    playbacks: number;
    events: number;
  };
};

export type AdminReport = {
  id: string;
  reporterUserId: string | null;
  contentId: string | null;
  creatorId: string | null;
  reportReason: string;
  reportSource: string;
  reportStatus: string;
  createdAt: string;
};

export type AdminAlert = {
  id: string;
  alertType: string;
  severity: 'info' | 'warning' | 'high' | 'critical';
  productSurface: string;
  targetReference: string;
  triggeredAt: string;
  resolvedAt: string | null;
};

export type AdminModerationAction = {
  id: string;
  reportId: string | null;
  targetType: string;
  targetId: string;
  actionType: string;
  actionReason: string;
  createdAt: string;
  createdBy: string | null;
  expiresAt: string | null;
};

export type AdminEvent = {
  id: string;
  eventName: string;
  productSurface: string;
  actorUserId: string | null;
  actorCreatorId: string | null;
  contentId: string | null;
  occurredAtUtc: string;
};

const API_BASE_URL = process.env.NORTHSTAR_API_BASE_URL ?? 'http://localhost:3001';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed for ${path} with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getAdminOverview() {
  const [echoOverview, openReports, recentAlerts, recentEvents, recentActions] =
    await Promise.all([
      fetchJson<EchoOverviewResponse>('/analytics/echo/overview'),
      fetchJson<AdminReport[]>('/trust/reports/open'),
      fetchJson<AdminAlert[]>('/trust/alerts/recent?limit=8'),
      fetchJson<AdminEvent[]>('/analytics/events/recent?limit=8'),
      fetchJson<AdminModerationAction[]>('/trust/moderation-actions/recent?limit=8'),
    ]);

  return {
    echoOverview,
    openReports,
    recentAlerts,
    recentEvents,
    recentActions,
  };
}

export function getOpenReports() {
  return fetchJson<AdminReport[]>('/trust/reports/open');
}

export function getRecentAlerts(limit = 20) {
  return fetchJson<AdminAlert[]>(`/trust/alerts/recent?limit=${limit}`);
}

export function getRecentModerationActions(limit = 20) {
  return fetchJson<AdminModerationAction[]>(
    `/trust/moderation-actions/recent?limit=${limit}`,
  );
}
