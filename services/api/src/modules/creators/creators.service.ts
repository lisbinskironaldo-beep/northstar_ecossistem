import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

export interface CreateCreatorProfileInput {
  userId: string;
  displayName: string;
  handle: string;
  bio?: string;
  primaryFront?: 'echo' | 'pulse' | 'lumen';
}

export interface CreateFollowInput {
  userId: string;
  creatorId: string;
}

export interface ListFollowedCreatorsInput {
  userId: string;
}

@Injectable()
export class CreatorsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AnalyticsService) private readonly analyticsService: AnalyticsService,
  ) {}

  async createProfile(input: CreateCreatorProfileInput) {
    const now = new Date();

    const creator = await this.prisma.creatorProfile.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        displayName: input.displayName,
        handle: input.handle,
        bio: input.bio,
        creatorStatus: 'active',
        creatorTier: 'new',
        primaryFront: input.primaryFront ?? 'echo',
        createdAt: now,
      },
      select: {
        id: true,
        userId: true,
        displayName: true,
        handle: true,
        bio: true,
        creatorStatus: true,
        creatorTier: true,
        primaryFront: true,
        createdAt: true,
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'creator.profile_created',
      actorUserId: creator.userId,
      actorCreatorId: creator.id,
      productSurface: creator.primaryFront as 'echo' | 'pulse' | 'lumen',
      payloadJson: {
        handle: creator.handle,
        creatorTier: creator.creatorTier,
      },
    });

    return creator;
  }

  async listProfiles() {
    return this.prisma.creatorProfile.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        displayName: true,
        handle: true,
        bio: true,
        creatorStatus: true,
        creatorTier: true,
        primaryFront: true,
        followerCountCached: true,
        publishedContentCountCached: true,
        createdAt: true,
      },
    });
  }

  async findProfile(creatorId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { id: creatorId },
      select: {
        id: true,
        userId: true,
        displayName: true,
        handle: true,
        bio: true,
        creatorStatus: true,
        creatorTier: true,
        primaryFront: true,
        followerCountCached: true,
        publishedContentCountCached: true,
        createdAt: true,
      },
    });

    if (!creator) {
      throw new NotFoundException(`Creator ${creatorId} not found`);
    }

    return creator;
  }

  listFollowedCreators(input: ListFollowedCreatorsInput) {
    return this.prisma.follow.findMany({
      where: {
        userId: input.userId,
        creator: {
          primaryFront: 'echo',
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        creatorId: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            displayName: true,
            handle: true,
            bio: true,
            creatorStatus: true,
            creatorTier: true,
            primaryFront: true,
            followerCountCached: true,
            publishedContentCountCached: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async createFollow(input: CreateFollowInput) {
    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        userId: input.userId,
        creatorId: input.creatorId,
      },
      select: {
        id: true,
        userId: true,
        creatorId: true,
        createdAt: true,
      },
    });

    if (existingFollow) {
      return {
        ...existingFollow,
        alreadyFollowing: true,
      };
    }

    const follow = await this.prisma.follow.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        creatorId: input.creatorId,
        createdAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        creatorId: true,
        createdAt: true,
      },
    });

    await this.prisma.creatorProfile.update({
      where: { id: input.creatorId },
      data: {
        followerCountCached: {
          increment: 1,
        },
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'creator.follow_created',
      actorUserId: follow.userId,
      actorCreatorId: follow.creatorId,
      productSurface: 'echo',
    });

    return {
      ...follow,
      alreadyFollowing: false,
    };
  }
}
