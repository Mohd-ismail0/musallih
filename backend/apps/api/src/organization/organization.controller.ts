import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
  constructor(private organization: OrganizationService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create organization' })
  create(@Body() dto: CreateOrganizationDto) {
    return this.organization.create(dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get organization by ID' })
  findOne(@Param('id') id: string) {
    return this.organization.findById(id);
  }
}
