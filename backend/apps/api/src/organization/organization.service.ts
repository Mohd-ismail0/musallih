import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateOrganizationDto } from './dto/create-organization.dto';

const ORG_INCLUDE = {
  authority: true,
  parentOrganization: { select: { id: true, name: true, type: true, branchType: true } },
  branches: { select: { id: true, name: true, type: true, branchType: true, geoLocation: true } },
} as const;

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const parentId = dto.parentOrganizationId;
    const branchType = dto.branchType ?? (parentId ? 'BRANCH' : 'STANDALONE');

    if (parentId) {
      const parent = await this.prisma.organization.findUnique({ where: { id: parentId } });
      if (!parent) {
        throw new BadRequestException('Parent organization not found');
      }
      if (branchType !== 'BRANCH') {
        throw new BadRequestException(
          'When parentOrganizationId is set, branchType must be BRANCH',
        );
      }
      if (parent.branchType === 'STANDALONE') {
        await this.prisma.organization.update({
          where: { id: parentId },
          data: { branchType: 'HEADQUARTERS' },
        });
      }
    }

    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: dto.type,
        authorityId: dto.authorityId,
        parentOrganizationId: parentId ?? undefined,
        branchType,
        description: dto.description,
        primaryContact: dto.primaryContact,
        verificationStatus: 'PENDING',
      },
      include: ORG_INCLUDE,
    });
  }

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: ORG_INCLUDE,
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async findBranches(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return this.prisma.organization.findMany({
      where: { parentOrganizationId: id },
      include: { authority: true },
    });
  }

  async findParent(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { parentOrganization: { include: { authority: true } } },
    });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.parentOrganization) {
      throw new NotFoundException('Organization has no parent (standalone or headquarters)');
    }
    return org.parentOrganization;
  }
}
