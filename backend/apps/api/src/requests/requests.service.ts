import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const req = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: { service: true, organization: true },
    });
    if (!req) throw new NotFoundException('Request not found');
    return req;
  }
}
