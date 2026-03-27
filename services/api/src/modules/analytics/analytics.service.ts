import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'node:crypto';

export interface TrackEventInput {
  eventName: string;
  actorUserId?: string;
  actorCreatorId?: string;
  contentId?: string;
  productSurface: 'echo' | 'pulse' | 'lumen';
  payloadJson?: Prisma.InputJsonValue;
}

@Injectable()
export class AnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private get analyticsClient(): PrismaClient {
    return this.prisma as PrismaClient;
  }

  async trackEvent(input: TrackEventInput) {
    return this.analyticsClient.eventLog.create({
      data: {
        id: randomUUID(),
        eventName: input.eventName,
        actorUserId: input.actorUserId,
        actorCreatorId: input.actorCreatorId,
        contentId: input.contentId,
        productSurface: input.productSurface,
        occurredAtUtc: new Date(),
        payloadJson: input.payloadJson,
      },
      select: {
        id: true,
        eventName: true,
        productSurface: true,
        occurredAtUtc: true,
      },
    });
  }

  async getEchoOverview() {
    const [users, creators, tracks, saves, playbacks, events] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.creatorProfile.count({
        where: { primaryFront: 'echo' },
      }),
      this.prisma.contentItem.count({
        where: { productSurface: 'echo', contentType: 'track' },
      }),
      this.prisma.save.count({
        where: { content: { productSurface: 'echo' } },
      }),
      this.prisma.playbackSession.count({
        where: { productSurface: 'echo' },
      }),
      this.analyticsClient.eventLog.count({
        where: { productSurface: 'echo' },
      }),
    ]);

    return {
      surface: 'echo',
      totals: {
        users,
        creators,
        tracks,
        saves,
        playbacks,
        events,
      },
    };
  }

  async listRecentEvents(limit = 20) {
    return this.analyticsClient.eventLog.findMany({
      orderBy: { occurredAtUtc: 'desc' },
      take: limit,
      select: {
        id: true,
        eventName: true,
        productSurface: true,
        actorUserId: true,
        actorCreatorId: true,
        contentId: true,
        occurredAtUtc: true,
      },
    });
  }
}
