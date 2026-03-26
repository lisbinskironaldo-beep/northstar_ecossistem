import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CreatorsModule } from './modules/creators/creators.module';
import { ContentModule } from './modules/content/content.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TrustModule } from './modules/trust/trust.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CreatorsModule,
    ContentModule,
    AnalyticsModule,
    TrustModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
