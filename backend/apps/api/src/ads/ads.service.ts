import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async getCampaign(id: string) {
    const c = await this.prisma.adCampaign.findUnique({
      where: { id },
      include: { advertiserOrg: true },
    });
    if (!c) throw new NotFoundException('Campaign not found');
    return c;
  }

  async getLedger(campaignId?: string) {
    return this.prisma.revenueLedger.findMany({
      where: campaignId ? { adEvent: { campaignId } } : undefined,
      include: { adEvent: true },
    });
  }
}
