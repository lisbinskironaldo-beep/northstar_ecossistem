import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateFollowInput,
  CreateCreatorProfileInput,
  CreatorsService,
  ListFollowedCreatorsInput,
} from './creators.service';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post()
  createProfile(@Body() body: CreateCreatorProfileInput) {
    return this.creatorsService.createProfile(body);
  }

  @Get()
  listProfiles() {
    return this.creatorsService.listProfiles();
  }

  @Get('users/:userId/follows')
  listFollowedCreators(@Param('userId') userId: string) {
    const query: ListFollowedCreatorsInput = { userId };
    return this.creatorsService.listFollowedCreators(query);
  }

  @Get(':creatorId')
  findProfile(@Param('creatorId') creatorId: string) {
    return this.creatorsService.findProfile(creatorId);
  }

  @Post(':creatorId/follows')
  createFollow(
    @Param('creatorId') creatorId: string,
    @Body() body: Omit<CreateFollowInput, 'creatorId'>,
  ) {
    return this.creatorsService.createFollow({
      ...body,
      creatorId,
    });
  }
}
