import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import {
  CreateModerationActionInput,
  CreateReportInput,
  TrustService,
  UpsertTrustScoreInput,
} from './trust.service';

@Controller('trust')
export class TrustController {
  constructor(@Inject(TrustService) private readonly trustService: TrustService) {}

  @Get('scores/:userId')
  getTrustScore(@Param('userId') userId: string) {
    return this.trustService.getTrustScore(userId);
  }

  @Post('scores')
  upsertTrustScore(@Body() body: UpsertTrustScoreInput) {
    return this.trustService.upsertTrustScore(body);
  }

  @Post('reports')
  createReport(@Body() body: CreateReportInput) {
    return this.trustService.createReport(body);
  }

  @Get('reports/open')
  listOpenReports() {
    return this.trustService.listOpenReports();
  }

  @Post('moderation-actions')
  createModerationAction(@Body() body: CreateModerationActionInput) {
    return this.trustService.createModerationAction(body);
  }

  @Get('alerts/recent')
  listRecentAlerts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : 20;

    return this.trustService.listRecentAlerts(
      Number.isFinite(parsedLimit) ? parsedLimit : 20,
    );
  }

  @Get('moderation-actions/recent')
  listRecentModerationActions(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : 20;

    return this.trustService.listRecentModerationActions(
      Number.isFinite(parsedLimit) ? parsedLimit : 20,
    );
  }
}
