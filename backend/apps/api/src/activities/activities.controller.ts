import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@ApiTags('activities')
@Controller('activities')
@Public()
export class ActivitiesController {
  constructor(private activities: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List activities by organization' })
  list(@Query('organizationId') organizationId?: string) {
    return this.activities.list(organizationId);
  }
}
