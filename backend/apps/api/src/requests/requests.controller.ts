import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RequestsService } from './requests.service';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private requests: RequestsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get service request' })
  findOne(@Param('id') id: string) {
    return this.requests.findById(id);
  }
}
