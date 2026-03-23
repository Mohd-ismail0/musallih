import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async listByRequester(requesterUserId: string) {
    if (!requesterUserId) {
      throw new UnauthorizedException('Authentication required');
    }
    const requests = await this.prisma.serviceRequest.findMany({
      where: { requesterUserId },
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    });

    return requests.map((r) => ({
      id: r.id,
      status: r.status,
      serviceType: r.service?.name ?? 'General',
      organizationId: r.organizationId,
    }));
  }

  async create(requesterUserId: string, dto: CreateRequestDto) {
    if (!requesterUserId) {
      throw new UnauthorizedException('Authentication required');
    }
    let service = dto.serviceId
      ? await this.prisma.service.findUnique({ where: { id: dto.serviceId } })
      : await this.prisma.service.findFirst({
          where: {
            ...(dto.organizationId ? { organizationId: dto.organizationId } : {}),
            ...(dto.serviceType ? { name: { contains: dto.serviceType, mode: 'insensitive' } } : {}),
          },
          orderBy: { id: 'asc' },
        });

    if (!service) {
      service = await this.prisma.service.findFirst({ orderBy: { id: 'asc' } });
    }

    if (!service) {
      throw new BadRequestException(
        'No matching service found. Provide serviceId or a valid organizationId/serviceType.',
      );
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        requesterUserId,
        organizationId: service.organizationId,
        serviceId: service.id,
        description: dto.description,
        urgencyLevel: dto.urgencyLevel,
        status: 'Submitted',
      },
      include: { service: true },
    });

    return {
      id: request.id,
      status: request.status,
      serviceType: request.service?.name ?? 'General',
      organizationId: request.organizationId,
    };
  }

  async findById(id: string) {
    const req = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: { service: true, organization: true },
    });
    if (!req) throw new NotFoundException('Request not found');
    return {
      id: req.id,
      status: req.status,
      serviceType: req.service?.name ?? 'General',
      organizationId: req.organizationId,
    };
  }
}
