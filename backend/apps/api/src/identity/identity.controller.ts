import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('identity')
@Controller('identity/users')
export class IdentityController {
  constructor(private identity: IdentityService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create user (signup)' })
  create(@Body() dto: CreateUserDto) {
    return this.identity.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.identity.findById(id);
  }
}
