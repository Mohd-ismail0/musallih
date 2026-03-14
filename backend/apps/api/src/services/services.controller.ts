import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('services')
@Controller('services')
@Public()
export class ServicesController {
  constructor(private services: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List services by organization' })
  list(@Query('organizationId') organizationId: string) {
    return this.services.listByOrganization(organizationId);
  }
}
