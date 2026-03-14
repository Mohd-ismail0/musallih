import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getHijriDate(gregorianDate: string) {
    return this.prisma.islamicCalendarDay.findUnique({
      where: { gregorianDate: new Date(gregorianDate) },
    });
  }
}
