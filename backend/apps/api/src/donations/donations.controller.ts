import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DonationsService } from './donations.service';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('donations')
@Controller('donations')
@Public()
export class DonationsController {
  constructor(private donations: DonationsService) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'List donation campaigns' })
  listCampaigns(@Query('organizationId') organizationId?: string) {
    return this.donations.listCampaigns(organizationId);
  }
}
