import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import { AnalyticsService } from '../analytics/analytics.service';

export interface RegisterUserInput {
  email: string;
  country?: string;
  preferredLanguage?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async register(input: RegisterUserInput) {
    const now = new Date();

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: input.email,
        accountStatus: 'active',
        country: input.country,
        preferredLanguage: input.preferredLanguage,
        createdAt: now,
        lastActiveAt: now,
        trustLevel: 'guarded',
      },
      select: {
        id: true,
        email: true,
        accountStatus: true,
        country: true,
        preferredLanguage: true,
        createdAt: true,
        trustLevel: true,
      },
    });

    await this.analyticsService.trackEvent({
      eventName: 'auth.user_registered',
      actorUserId: user.id,
      productSurface: 'echo',
      payloadJson: {
        country: user.country,
        preferredLanguage: user.preferredLanguage,
      },
    });

    return user;
  }

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        accountStatus: true,
        country: true,
        preferredLanguage: true,
        createdAt: true,
        lastActiveAt: true,
        trustLevel: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    return user;
  }
}
