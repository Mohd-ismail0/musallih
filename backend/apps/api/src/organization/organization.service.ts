import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: dto.type,
        authorityId: dto.authorityId,
        description: dto.description,
        primaryContact: dto.primaryContact,
        verificationStatus: 'PENDING',
      },
    });
  }

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { authority: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
}
