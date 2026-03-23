import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class PrayerService {
  constructor(private prisma: PrismaService) {}

  async getTimes(organizationId?: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const row = await this.prisma.masjidPrayerTime.findFirst({
      where: {
        ...(organizationId ? { organizationId } : {}),
        date: { gte: dayStart, lt: dayEnd },
      },
      orderBy: { date: 'asc' },
    });

    if (!row) return null;

    return {
      date: dayStart.toISOString().slice(0, 10),
      fajr: row.fajrStart.toISOString(),
      dhuhr: row.dhuhr.toISOString(),
      asr: row.asr.toISOString(),
      maghrib: row.maghrib.toISOString(),
      isha: row.isha.toISOString(),
    };
  }
}
