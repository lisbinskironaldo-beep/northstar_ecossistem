import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

export interface UpsertTrustScoreInput {
  userId: string;
  creatorId?: string;
  scoreValue: number;
  scoreBand: 'low' | 'guarded' | 'normal' | 'trusted';
}

export interface CreateReportInput {
  reporterUserId?: string;
  contentId?: string;
  creatorId?: string;
  reportReason:
    | 'not_ai_content'
    | 'duplicate_or_spam'
    | 'abusive'
    | 'impersonation'
    | 'rights_or_ownership_issue'
    | 'adult_or_prohibited'
    | 'low_quality_spam';
  reportSource: 'user' | 'system' | 'admin';
}

export interface CreateModerationActionInput {
  reportId?: string;
  targetType: 'content' | 'creator' | 'user';
  targetId: string;
  actionType:
    | 'reduce_reach'
    | 'limit_upload'
    | 'archive_content'
    | 'remove_content'
    | 'suspend_user'
    | 'ban_user';
  actionReason: string;
  createdBy?: string;
  expiresAt?: string;
}

@Injectable()
export class TrustService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  private get db(): PrismaClient {
    return this.prisma as PrismaClient;
  }

  async getTrustScore(userId: string) {
    const trustScore = await this.db.trustScore.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        userId: true,
        creatorId: true,
        scoreValue: true,
        scoreBand: true,
        updatedAt: true,
      },
    });

    if (!trustScore) {
      throw new NotFoundException(`Trust score for user ${userId} not found`);
    }

    return trustScore;
  }

  async upsertTrustScore(input: UpsertTrustScoreInput) {
    const existing = await this.db.trustScore.findFirst({
      where: {
        userId: input.userId,
        creatorId: input.creatorId ?? null,
      },
      select: { id: true },
    });

    if (existing) {
      return this.db.trustScore.update({
        where: { id: existing.id },
        data: {
          scoreValue: input.scoreValue,
          scoreBand: input.scoreBand,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          userId: true,
          creatorId: true,
          scoreValue: true,
          scoreBand: true,
          updatedAt: true,
        },
      });
    }

    return this.db.trustScore.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        creatorId: input.creatorId,
        scoreValue: input.scoreValue,
        scoreBand: input.scoreBand,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        creatorId: true,
        scoreValue: true,
        scoreBand: true,
        updatedAt: true,
      },
    });
  }

  async createReport(input: CreateReportInput) {
    const report = await this.db.report.create({
      data: {
        id: randomUUID(),
        reporterUserId: input.reporterUserId,
        contentId: input.contentId,
        creatorId: input.creatorId,
        reportReason: input.reportReason,
        reportSource: input.reportSource,
        reportStatus: 'open',
        createdAt: new Date(),
      },
      select: {
        id: true,
        reporterUserId: true,
        contentId: true,
        creatorId: true,
        reportReason: true,
        reportSource: true,
        reportStatus: true,
        createdAt: true,
      },
    });

    await this.createAlertIfThresholdReached(report.contentId, report.creatorId);
    await this.analyticsService.trackEvent({
      eventName: 'trust.report_created',
      actorUserId: report.reporterUserId ?? undefined,
      actorCreatorId: report.creatorId ?? undefined,
      contentId: report.contentId ?? undefined,
      productSurface: 'echo',
      payloadJson: {
        reportReason: report.reportReason,
        reportSource: report.reportSource,
        reportStatus: report.reportStatus,
      },
    });

    return report;
  }

  listOpenReports() {
    return this.db.report.findMany({
      where: { reportStatus: 'open' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reporterUserId: true,
        contentId: true,
        creatorId: true,
        reportReason: true,
        reportSource: true,
        reportStatus: true,
        createdAt: true,
      },
    });
  }

  async createModerationAction(input: CreateModerationActionInput) {
    const moderationAction = await (this.db as any).moderationAction.create({
      data: {
        id: randomUUID(),
        reportId: input.reportId,
        targetType: input.targetType,
        targetId: input.targetId,
        actionType: input.actionType,
        actionReason: input.actionReason,
        createdAt: new Date(),
        createdBy: input.createdBy,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      },
      select: {
        id: true,
        reportId: true,
        targetType: true,
        targetId: true,
        actionType: true,
        actionReason: true,
        createdAt: true,
        createdBy: true,
        expiresAt: true,
      },
    });

    await this.applyModerationEffect(input);
    const resolvedReport = await this.resolveReportIfLinked(moderationAction.reportId);
    await this.analyticsService.trackEvent({
      eventName: 'trust.moderation_action_created',
      contentId: input.targetType === 'content' ? input.targetId : undefined,
      productSurface: 'echo',
      payloadJson: {
        reportId: moderationAction.reportId,
        reportStatus: resolvedReport?.reportStatus,
        targetType: moderationAction.targetType,
        targetId: moderationAction.targetId,
        actionType: moderationAction.actionType,
        createdBy: moderationAction.createdBy,
      },
    });

    return moderationAction;
  }

  listRecentAlerts(limit = 20) {
    return this.db.alert.findMany({
      orderBy: { triggeredAt: 'desc' },
      take: limit,
      select: {
        id: true,
        alertType: true,
        severity: true,
        productSurface: true,
        targetReference: true,
        triggeredAt: true,
        resolvedAt: true,
      },
    });
  }

  listRecentModerationActions(limit = 20) {
    return (this.db as any).moderationAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        reportId: true,
        targetType: true,
        targetId: true,
        actionType: true,
        actionReason: true,
        createdAt: true,
        createdBy: true,
        expiresAt: true,
      },
    });
  }

  private async createAlertIfThresholdReached(
    contentId?: string | null,
    creatorId?: string | null,
  ) {
    const where: Prisma.ReportWhereInput = {
      reportStatus: 'open',
      ...(contentId ? { contentId } : {}),
      ...(creatorId ? { creatorId } : {}),
    };

    const openReports = await this.db.report.count({ where });

    if (openReports < 3) {
      return;
    }

    const targetReference = contentId ?? creatorId ?? 'unknown';

    await this.db.alert.create({
      data: {
        id: randomUUID(),
        alertType: 'report_threshold_reached',
        severity: openReports >= 5 ? 'high' : 'warning',
        productSurface: 'echo',
        targetReference,
        triggeredAt: new Date(),
        detailsJson: {
          openReports,
          contentId,
          creatorId,
        },
      },
    });
  }

  private async applyModerationEffect(input: CreateModerationActionInput) {
    if (input.targetType === 'content') {
      if (input.actionType === 'reduce_reach') {
        await this.db.contentItem.update({
          where: { id: input.targetId },
          data: { visibilityState: 'suppressed' },
        });
      }

      if (input.actionType === 'archive_content') {
        await this.db.contentItem.update({
          where: { id: input.targetId },
          data: {
            contentState: 'archived',
            archivedAt: new Date(),
          },
        });
      }

      if (input.actionType === 'remove_content') {
        await this.db.contentItem.update({
          where: { id: input.targetId },
          data: {
            contentState: 'removed',
            visibilityState: 'hidden',
          },
        });
      }
    }

    if (input.targetType === 'user') {
      if (input.actionType === 'suspend_user') {
        await this.db.user.update({
          where: { id: input.targetId },
          data: { accountStatus: 'suspended' },
        });
      }

      if (input.actionType === 'ban_user') {
        await this.db.user.update({
          where: { id: input.targetId },
          data: { accountStatus: 'banned' },
        });
      }
    }

    if (input.targetType === 'creator' && input.actionType === 'limit_upload') {
      await this.db.creatorProfile.update({
        where: { id: input.targetId },
        data: { creatorStatus: 'restricted' },
      });
    }
  }

  private async resolveReportIfLinked(reportId?: string | null) {
    if (!reportId) {
      return null;
    }

    return this.db.report.update({
      where: { id: reportId },
      data: {
        reportStatus: 'resolved',
        resolvedAt: new Date(),
      },
      select: {
        id: true,
        reportStatus: true,
        resolvedAt: true,
      },
    });
  }
}
