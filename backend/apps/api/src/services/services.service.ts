import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async listByOrganization(organizationId: string) {
    return this.prisma.service.findMany({
      where: { organizationId },
    });
  }
}
