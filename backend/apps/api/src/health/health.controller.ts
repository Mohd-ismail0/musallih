import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma';
import { JobsService } from '../jobs/jobs.service';

@ApiTags('health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobs: JobsService,
  ) {}

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
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        checks: {
          database: 'ok',
          jobs: this.jobs.isReady() ? 'ok' : 'degraded',
        },
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        checks: {
          database: 'error',
          jobs: this.jobs.isReady() ? 'ok' : 'degraded',
        },
      });
    }
  }
}
