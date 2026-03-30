import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import {
  ContentService,
  CreateSaveInput,
  CreateTrackInput,
  ListSavedTracksInput,
  ListCategoriesInput,
  ListTracksInput,
  RecordPlaybackInput,
} from './content.service';

@Controller('content')
export class ContentController {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  @Get('categories')
  listCategories(@Query() query: ListCategoriesInput) {
    return this.contentService.listCategories(query);
  }

  @Get('tracks')
  listTracks(@Query() query: ListTracksInput & { limit?: string | number }) {
    const parsedLimit =
      typeof query.limit === 'string' ? Number.parseInt(query.limit, 10) : query.limit;

    return this.contentService.listTracks({
      ...query,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    });
  }

  @Get('tracks/:contentId')
  getTrack(@Param('contentId') contentId: string) {
    return this.contentService.getTrack(contentId);
  }

  @Get('users/:userId/saves')
  listSavedTracks(@Param('userId') userId: string) {
    const query: ListSavedTracksInput = { userId };
    return this.contentService.listSavedTracks(query);
  }

  @Post('tracks')
  createTrack(@Body() body: CreateTrackInput) {
    return this.contentService.createTrack(body);
  }

  @Post('tracks/:contentId/saves')
  createSave(
    @Param('contentId') contentId: string,
    @Body() body: Omit<CreateSaveInput, 'contentId'>,
  ) {
    return this.contentService.createSave({
      ...body,
      contentId,
    });
  }

  @Post('tracks/:contentId/playbacks')
  recordPlayback(
    @Param('contentId') contentId: string,
    @Body() body: Omit<RecordPlaybackInput, 'contentId'>,
  ) {
    return this.contentService.recordPlayback({
      ...body,
      contentId,
    });
  }
}
