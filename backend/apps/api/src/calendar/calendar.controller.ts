import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { Public } from '../auth/jwt-auth.guard';

@ApiTags('calendar')
@Controller('calendar')
@Public()
export class CalendarController {
  constructor(private calendar: CalendarService) {}

  @Get('hijri')
  @ApiOperation({ summary: 'Get Hijri date for Gregorian date' })
  getHijri(@Query('date') date: string) {
    return this.calendar.getHijriDate(date);
  }
}
