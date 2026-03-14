import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { IdentityModule } from './identity/identity.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthorityModule } from './authority/authority.module';
import { PrayerModule } from './prayer/prayer.module';
import { CalendarModule } from './calendar/calendar.module';
import { AdsModule } from './ads/ads.module';
import { JobsModule } from './jobs/jobs.module';
import { ServicesModule } from './services/services.module';
import { RequestsModule } from './requests/requests.module';
import { DonationsModule } from './donations/donations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HealthModule,
    IdentityModule,
    OrganizationModule,
    AuthorityModule,
    PrayerModule,
    CalendarModule,
    AdsModule,
    JobsModule,
    ServicesModule,
    RequestsModule,
    DonationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
