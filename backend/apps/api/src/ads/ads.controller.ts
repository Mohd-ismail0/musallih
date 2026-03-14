import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdsService } from './ads.service';

@ApiTags('ads')
@Controller('ads')
export class AdsController {
  constructor(private ads: AdsService) {}

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get ad campaign' })
  getCampaign(@Param('id') id: string) {
    return this.ads.getCampaign(id);
  }

  @Get('ledger')
  @ApiOperation({ summary: 'Get revenue ledger' })
  getLedger(@Query('campaignId') campaignId?: string) {
    return this.ads.getLedger(campaignId);
  }
}
