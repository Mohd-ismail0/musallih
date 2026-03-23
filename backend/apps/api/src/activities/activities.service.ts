import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async list(organizationId?: string) {
    return this.prisma.activity.findMany({
      where: organizationId ? { organizationId } : undefined,
      orderBy: { startTime: 'asc' },
      select: {
        id: true,
        title: true,
        organizationId: true,
      },
    });
  }
}
