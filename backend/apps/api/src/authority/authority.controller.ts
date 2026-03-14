import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthorityService } from './authority.service';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('authority')
@Controller('authority')
export class AuthorityController {
  constructor(private authority: AuthorityService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List authorities' })
  findAll(@Query('level') level?: string) {
    return this.authority.findAll(level);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get authority by ID' })
  findOne(@Param('id') id: string) {
    return this.authority.findById(id);
  }
}
