import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private requests: RequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List current user service requests' })
  list(@Req() req: { user?: { sub?: string } }) {
    return this.requests.listByRequester(req.user?.sub ?? '');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service request' })
  create(@Req() req: { user?: { sub?: string } }, @Body() dto: CreateRequestDto) {
    return this.requests.create(req.user?.sub ?? '', dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service request' })
  findOne(@Param('id') id: string) {
    return this.requests.findById(id);
  }
}
