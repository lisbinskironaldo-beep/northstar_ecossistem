import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AnalyticsService, TrackEventInput } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  trackEvent(@Body() body: TrackEventInput) {
    return this.analyticsService.trackEvent(body);
  }

  @Get('echo/overview')
  getEchoOverview() {
    return this.analyticsService.getEchoOverview();
  }

  @Get('events/recent')
  listRecentEvents(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : 20;

    return this.analyticsService.listRecentEvents(
      Number.isFinite(parsedLimit) ? parsedLimit : 20,
    );
  }
}
