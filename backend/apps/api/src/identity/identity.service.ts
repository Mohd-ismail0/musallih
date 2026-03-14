import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        dob: dto.dob ? new Date(dto.dob) : undefined,
        gender: dto.gender,
        maritalStatus: dto.maritalStatus,
        cityId: dto.cityId,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
