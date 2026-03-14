import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [HealthController],
})
export class HealthModule {}
