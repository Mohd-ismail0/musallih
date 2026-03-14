import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class PrayerService {
  constructor(private prisma: PrismaService) {}

  async getTimes(organizationId: string, date: string) {
    return this.prisma.masjidPrayerTime.findFirst({
      where: { organizationId, date: new Date(date) },
    });
  }
}
