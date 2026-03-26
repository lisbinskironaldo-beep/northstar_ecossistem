'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NORTHSTAR_API_BASE_URL ?? 'http://localhost:3001';

export async function createModerationAction(formData: FormData) {
  const reportId = String(formData.get('reportId') ?? '').trim();
  const targetType = String(formData.get('targetType') ?? '').trim();
  const targetId = String(formData.get('targetId') ?? '').trim();
  const actionType = String(formData.get('actionType') ?? '').trim();
  const actionReason = String(formData.get('actionReason') ?? '').trim();
  const createdBy = String(formData.get('createdBy') ?? 'founder').trim();
  const expiresAt = String(formData.get('expiresAt') ?? '').trim();

  if (!targetType || !targetId || !actionType || !actionReason) {
    redirect('/actions?status=missing-fields');
  }

  const response = await fetch(`${API_BASE_URL}/trust/moderation-actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reportId: reportId || undefined,
      targetType,
      targetId,
      actionType,
      actionReason,
      createdBy,
      expiresAt: expiresAt || undefined,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    redirect('/actions?status=failed');
  }

  revalidatePath('/');
  revalidatePath('/reports');
  revalidatePath('/alerts');
  revalidatePath('/actions');

  redirect('/actions?status=success');
}
