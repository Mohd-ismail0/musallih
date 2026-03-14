import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class AuthorityService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const authority = await this.prisma.authority.findUnique({
      where: { id },
      include: { parent: true, children: true },
    });
    if (!authority) throw new NotFoundException('Authority not found');
    return authority;
  }

  async findAll(level?: string) {
    return this.prisma.authority.findMany({
      where: level ? { level } : undefined,
      include: { parent: true },
    });
  }
}
