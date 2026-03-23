import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getHijriDate(gregorianDate?: string) {
    const targetDate = gregorianDate ? new Date(gregorianDate) : new Date();
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const row = await this.prisma.islamicCalendarDay.findFirst({
      where: { gregorianDate: { gte: dayStart, lt: dayEnd } },
      orderBy: { gregorianDate: 'asc' },
    });

    if (!row) return null;

    return {
      gregorianDate: dayStart.toISOString().slice(0, 10),
      hijriDate: row.hijriDate,
    };
  }
}
