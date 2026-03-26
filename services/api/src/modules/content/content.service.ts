import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

export interface ListCategoriesInput {
  surface?: 'echo' | 'pulse' | 'lumen';
}

export interface ListTracksInput {
  surface?: 'echo' | 'pulse' | 'lumen';
  limit?: number;
}

export interface CreateTrackInput {
  creatorId: string;
  title: string;
  description?: string;
  primaryCategoryId?: string;
  artistNameDisplay: string;
  aiDeclaration: boolean;
  sourceToolOptional?: string;
}

export interface CreateSaveInput {
  userId: string;
  contentId: string;
}

export interface RecordPlaybackInput {
  userId?: string;
  contentId: string;
  listenedMs: number;
  completionRatio: number;
  replayCountInSession?: number;
  sourceContext?: string;
}

export interface ListSavedTracksInput {
  userId: string;
}

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  listCategories(input: ListCategoriesInput) {
    return this.prisma.category.findMany({
      where: input.surface ? { productSurface: input.surface } : undefined,
      orderBy: [{ rankOrder: 'asc' }, { displayName: 'asc' }],
      select: {
        id: true,
        productSurface: true,
        slug: true,
        displayName: true,
        activeFlag: true,
        rankOrder: true,
      },
    });
  }

  listTracks(input: ListTracksInput) {
    return this.prisma.contentItem.findMany({
      where: {
        productSurface: input.surface ?? 'echo',
        contentType: 'track',
      },
      orderBy: { createdAt: 'desc' },
      take: input.limit ?? 20,
      select: {
        id: true,
        title: true,
        description: true,
        contentState: true,
        visibilityState: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            displayName: true,
            handle: true,
          },
        },
        track: {
          select: {
            id: true,
            artistNameDisplay: true,
            aiDeclaration: true,
            sourceToolOptional: true,
          },
        },
      },
    });
  }

  listSavedTracks(input: ListSavedTracksInput) {
    return this.prisma.save.findMany({
      where: {
        userId: input.userId,
        content: {
          productSurface: 'echo',
          contentType: 'track',
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        contentId: true,
        createdAt: true,
        content: {
          select: {
            id: true,
            title: true,
            description: true,
            contentState: true,
            visibilityState: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                displayName: true,
                handle: true,
              },
            },
            track: {
              select: {
                id: true,
                artistNameDisplay: true,
                aiDeclaration: true,
                sourceToolOptional: true,
              },
            },
          },
        },
      },
    });
  }

  async createTrack(input: CreateTrackInput) {
    const now = new Date();

    const track = await this.prisma.contentItem.create({
      data: {
        id: randomUUID(),
        creatorId: input.creatorId,
        productSurface: 'echo',
        contentType: 'track',
        contentState: 'draft',
        visibilityState: 'hidden',
        trustState: 'normal',
        title: input.title,
        description: input.description,
        primaryCategoryId: input.primaryCategoryId,
        createdAt: now,
        track: {
          create: {
            id: randomUUID(),
            artistNameDisplay: input.artistNameDisplay,
            aiDeclaration: input.aiDeclaration,
            sourceToolOptional: input.sourceToolOptional,
          },
        },
      },
      select: {
        id: true,
        productSurface: true,
        contentType: true,
        contentState: true,
        visibilityState: true,
        trustState: true,
        title: true,
        description: true,
        createdAt: true,
        track: {
          select: {
            id: true,
            artistNameDisplay: true,
            aiDeclaration: true,
            sourceToolOptional: true,
          },
        },
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'content.track_created',
      actorCreatorId: input.creatorId,
      contentId: track.id,
      productSurface: 'echo',
      payloadJson: {
        title: track.title,
        aiDeclaration: track.track?.aiDeclaration ?? true,
      },
    });

    return track;
  }

  async createSave(input: CreateSaveInput) {
    const existingSave = await this.prisma.save.findFirst({
      where: {
        userId: input.userId,
        contentId: input.contentId,
      },
      select: {
        id: true,
        userId: true,
        contentId: true,
        createdAt: true,
      },
    });

    if (existingSave) {
      return {
        ...existingSave,
        alreadySaved: true,
      };
    }

    const save = await this.prisma.save.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        contentId: input.contentId,
        createdAt: new Date(),
      },
      select: {
        id: true,
        userId: true,
        contentId: true,
        createdAt: true,
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'content.track_saved',
      actorUserId: save.userId,
      contentId: save.contentId,
      productSurface: 'echo',
    });

    return {
      ...save,
      alreadySaved: false,
    };
  }

  async recordPlayback(input: RecordPlaybackInput) {
    const playback = await this.prisma.playbackSession.create({
      data: {
        id: randomUUID(),
        userId: input.userId,
        contentId: input.contentId,
        productSurface: 'echo',
        startedAt: new Date(),
        endedAt: new Date(),
        listenedMs: input.listenedMs,
        completionRatio: input.completionRatio,
        replayCountInSession: input.replayCountInSession ?? 0,
        sourceContext: input.sourceContext,
      },
      select: {
        id: true,
        userId: true,
        contentId: true,
        productSurface: true,
        listenedMs: true,
        completionRatio: true,
        replayCountInSession: true,
        sourceContext: true,
        startedAt: true,
        endedAt: true,
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'content.playback_recorded',
      actorUserId: playback.userId ?? undefined,
      contentId: playback.contentId,
      productSurface: 'echo',
      payloadJson: {
        listenedMs: playback.listenedMs,
        completionRatio: Number(playback.completionRatio),
        replayCountInSession: playback.replayCountInSession,
        sourceContext: playback.sourceContext,
      },
    });

    return playback;
  }
}
