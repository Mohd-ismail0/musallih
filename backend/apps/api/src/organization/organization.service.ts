import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { NearbyOrganizationsQueryDto } from './dto/nearby-organizations-query.dto';

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

  async findNearby(query: NearbyOrganizationsQueryDto) {
    const bbox = this.parseBbox(query.bbox);
    const mappedType = this.mapCategoryToType(query.category);
    const sectFilters = this.parseCsv(query.sect);
    const timingFilters = this.parseCsv(query.timing);
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const organizations = await this.prisma.organization.findMany({
      where: {
        geoLocation: { not: null },
        ...(mappedType ? { type: mappedType } : {}),
        ...(sectFilters.length > 0
          ? {
              schools: {
                some: {
                  OR: sectFilters.map((sect) => ({
                    school: { name: { equals: sect, mode: 'insensitive' } },
                  })),
                },
              },
            }
          : {}),
      },
      include: {
        schools: { include: { school: true } },
        masjidPrayerTimes: {
          where: { date: { gte: dayStart, lt: dayEnd } },
          select: { fajrStart: true, ishaEnd: true },
          take: 1,
        },
      },
      take: 500,
      orderBy: { createdAt: 'desc' },
    });

    return organizations
      .map((org) => {
        const coords = this.parseGeoLocation(org.geoLocation);
        if (!coords) return null;
        if (bbox && !this.inBbox(coords, bbox)) return null;

        const openNow = org.masjidPrayerTimes.some(
          (slot) => now >= slot.fajrStart && now <= slot.ishaEnd,
        );
        const primarySchool = org.schools.find((s) => s.isPrimary)?.school?.name;
        const firstSchool = org.schools[0]?.school?.name;
        const sect = primarySchool ?? firstSchool;

        if (timingFilters.includes('OpenNow') && !openNow) return null;

        return {
          id: org.id,
          name: org.name,
          type: org.type,
          lat: coords.lat,
          lng: coords.lng,
          sect,
          openNow,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null);
  }

  private parseCsv(value?: string): string[] {
    if (!value) return [];
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  private parseBbox(value?: string): [number, number, number, number] | null {
    if (!value) return null;
    const nums = value
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((n) => Number.isFinite(n));
    if (nums.length !== 4) return null;
    return [nums[0], nums[1], nums[2], nums[3]];
  }

  private mapCategoryToType(category?: string): string | null {
    if (!category || category.toLowerCase() === 'all') return null;
    const c = category.trim().toLowerCase();
    if (c === 'masjid') return 'MASJID';
    if (c === 'madrasa') return 'MADRASA';
    if (c === 'welfare') return 'WELFARE';
    if (c === 'burial') return 'BURIAL';
    if (c === 'business' || c === 'restaurants') return 'BUSINESS';
    if (c === 'islamic orgs') return 'NGO';
    return null;
  }

  private parseGeoLocation(
    geoLocation?: string | null,
  ): { lat: number; lng: number } | null {
    if (!geoLocation) return null;
    const value = geoLocation.trim();

    const pointMatch = /^POINT\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/i.exec(value);
    if (pointMatch) {
      const lng = Number(pointMatch[1]);
      const lat = Number(pointMatch[3]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
    }

    const latLng = value.split(',').map((p) => Number(p.trim()));
    if (latLng.length === 2 && Number.isFinite(latLng[0]) && Number.isFinite(latLng[1])) {
      return { lat: latLng[0], lng: latLng[1] };
    }

    try {
      const parsed = JSON.parse(value) as { type?: string; coordinates?: number[] };
      if (
        parsed?.type?.toLowerCase() === 'point' &&
        Array.isArray(parsed.coordinates) &&
        parsed.coordinates.length >= 2
      ) {
        const lng = Number(parsed.coordinates[0]);
        const lat = Number(parsed.coordinates[1]);
        if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
      }
    } catch {
      return null;
    }

    return null;
  }

  private inBbox(
    coords: { lat: number; lng: number },
    bbox: [number, number, number, number],
  ): boolean {
    const [minLng, minLat, maxLng, maxLat] = bbox;
    return (
      coords.lng >= minLng &&
      coords.lng <= maxLng &&
      coords.lat >= minLat &&
      coords.lat <= maxLat
    );
  }
}
