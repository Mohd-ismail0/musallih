import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('health')
@Controller('health')
@Public()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  live() {
    return { status: 'alive' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async ready() {
    // TODO: check DB, Redis connectivity
    return { status: 'ready' };
  }
}
