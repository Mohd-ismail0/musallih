import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Public } from '../auth/jwt-auth.guard';
import { NearbyOrganizationsQueryDto } from './dto/nearby-organizations-query.dto';

@ApiTags('organization')
@Controller(['organization', 'organizations'])
export class OrganizationController {
  constructor(private organization: OrganizationService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create organization' })
  create(@Body() dto: CreateOrganizationDto) {
    return this.organization.create(dto);
  }

  @Get(':id/branches')
  @Public()
  @ApiOperation({ summary: 'List branches of an organization' })
  findBranches(@Param('id') id: string) {
    return this.organization.findBranches(id);
  }

  @Get(':id/parent')
  @Public()
  @ApiOperation({ summary: 'Get parent organization (for branches)' })
  findParent(@Param('id') id: string) {
    return this.organization.findParent(id);
  }

  @Get('nearby')
  @Public()
  @ApiOperation({ summary: 'Find nearby organizations for map discovery' })
  nearby(@Query() query: NearbyOrganizationsQueryDto) {
    return this.organization.findNearby(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get organization by ID (includes parent and branches)' })
  findOne(@Param('id') id: string) {
    return this.organization.findById(id);
  }
}
