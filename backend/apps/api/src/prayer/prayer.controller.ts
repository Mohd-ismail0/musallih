import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrayerService } from './prayer.service';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('prayer')
@Controller('prayer')
@Public()
export class PrayerController {
  constructor(private prayer: PrayerService) {}

  @Get('times')
  @ApiOperation({ summary: 'Get prayer times for organization' })
  getTimes(@Query('organizationId') organizationId: string, @Query('date') date: string) {
    return this.prayer.getTimes(organizationId, date);
  }
}
