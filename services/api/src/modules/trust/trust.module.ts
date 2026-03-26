import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { TrustController } from './trust.controller';
import { TrustService } from './trust.service';

@Module({
  imports: [AnalyticsModule],
  controllers: [TrustController],
  providers: [TrustService],
  exports: [TrustService],
})
export class TrustModule {}
