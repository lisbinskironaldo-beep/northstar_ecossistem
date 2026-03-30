import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

export interface ListCategoriesInput {
  surface?: 'echo' | 'pulse' | 'lumen';
}

export interface ListTracksInput {
  surface?: 'echo' | 'pulse' | 'lumen';
  limit?: number;
  creatorId?: string;
}

export interface CreateTrackInput {
  creatorId: string;
  title: string;
  description?: string;
  primaryCategoryId?: string;
  artistNameDisplay: string;
  accessRoom?: string;
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

const contentAssetSelect = {
  id: true,
  assetRole: true,
  storageProvider: true,
  storageKey: true,
  mimeType: true,
  durationMs: true,
  transcodedState: true,
  createdAt: true,
} as const;

@Injectable()
export class ContentService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AnalyticsService) private readonly analyticsService: AnalyticsService,
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
    return this.prisma.contentItem
      .findMany({
      where: {
        productSurface: input.surface ?? 'echo',
        contentType: 'track',
        creatorId: input.creatorId,
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
        assets: {
          orderBy: { createdAt: 'asc' },
          select: contentAssetSelect,
        },
        primaryCategory: {
          select: {
            id: true,
            slug: true,
            displayName: true,
          },
        },
        creator: {
          select: {
            id: true,
            displayName: true,
            handle: true,
            followerCountCached: true,
            publishedContentCountCached: true,
          },
        },
        track: {
          select: {
            id: true,
            artistNameDisplay: true,
            accessRoom: true,
            aiDeclaration: true,
            sourceToolOptional: true,
          },
        },
      },
      })
      .then((tracks) => tracks.map((track) => this.decorateTrack(track)));
  }

  listSavedTracks(input: ListSavedTracksInput) {
    return this.prisma.save
      .findMany({
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
            assets: {
              orderBy: { createdAt: 'asc' },
              select: contentAssetSelect,
            },
            primaryCategory: {
              select: {
                id: true,
                slug: true,
                displayName: true,
              },
            },
            creator: {
              select: {
                id: true,
                displayName: true,
                handle: true,
                followerCountCached: true,
                publishedContentCountCached: true,
              },
            },
            track: {
              select: {
                id: true,
                artistNameDisplay: true,
                accessRoom: true,
                aiDeclaration: true,
                sourceToolOptional: true,
              },
            },
          },
        },
      },
      })
      .then((entries) =>
        entries.map((entry) => ({
          ...entry,
          content: this.decorateTrack(entry.content),
        })),
      );
  }

  async getTrack(contentId: string) {
    const track = await this.prisma.contentItem.findFirst({
      where: {
        id: contentId,
        productSurface: 'echo',
        contentType: 'track',
      },
      select: {
        id: true,
        title: true,
        description: true,
        contentState: true,
        visibilityState: true,
        createdAt: true,
        assets: {
          orderBy: { createdAt: 'asc' },
          select: contentAssetSelect,
        },
        primaryCategory: {
          select: {
            id: true,
            slug: true,
            displayName: true,
          },
        },
        creator: {
          select: {
            id: true,
            displayName: true,
            handle: true,
            followerCountCached: true,
            publishedContentCountCached: true,
          },
        },
        track: {
          select: {
            id: true,
            artistNameDisplay: true,
            accessRoom: true,
            aiDeclaration: true,
            sourceToolOptional: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return this.decorateTrack(track);
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
            accessRoom: input.accessRoom ?? 'standard',
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
        assets: {
          orderBy: { createdAt: 'asc' },
          select: contentAssetSelect,
        },
        primaryCategory: {
          select: {
            id: true,
            slug: true,
            displayName: true,
          },
        },
        track: {
          select: {
            id: true,
            artistNameDisplay: true,
            accessRoom: true,
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
        accessRoom: track.track?.accessRoom ?? 'standard',
        aiDeclaration: track.track?.aiDeclaration ?? true,
      },
    });

    return this.decorateTrack(track);
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

  private decorateTrack<
    T extends {
      assets?: Array<{
        storageProvider: string;
        storageKey: string;
      }>;
    },
  >(track: T) {
    return {
      ...track,
      assets:
        track.assets?.map((asset) => ({
          ...asset,
          publicPath:
            asset.storageProvider === 'remote_url' || /^https?:\/\//i.test(asset.storageKey)
              ? asset.storageKey
              : `/media/${asset.storageKey}`,
        })) ?? [],
    };
  }
}
