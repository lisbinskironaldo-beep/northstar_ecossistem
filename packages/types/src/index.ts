export type ProductSurface = 'echo' | 'pulse' | 'lumen';

export type AccountStatus = 'active' | 'limited' | 'suspended' | 'banned' | 'pending_review';

export interface HealthResponse {
  service: string;
  status: 'ok';
}
