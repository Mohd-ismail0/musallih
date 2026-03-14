import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async listCampaigns(organizationId?: string) {
    return this.prisma.donationCampaign.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { organization: true },
    });
  }
}
