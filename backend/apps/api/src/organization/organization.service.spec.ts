import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../prisma';
import { CreateOrganizationDto } from './dto/create-organization.dto';

describe('OrganizationService', () => {
  let service: OrganizationService;
  const prismaMock = {
    organization: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get<OrganizationService>(OrganizationService);
  });

  describe('create', () => {
    const baseDto: CreateOrganizationDto = {
      name: 'Test Masjid',
      type: 'MASJID',
      authorityId: 'auth-1',
    };

    it('creates standalone organization by default', async () => {
      prismaMock.organization.create.mockResolvedValue({
        id: 'org-1',
        name: 'Test Masjid',
        type: 'MASJID',
        branchType: 'STANDALONE',
      });
      const result = await service.create(baseDto);
      expect(prismaMock.organization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Test Masjid',
            branchType: 'STANDALONE',
            parentOrganizationId: undefined,
          }),
        }),
      );
      expect(result.branchType).toBe('STANDALONE');
    });

    it('creates branch when parentOrganizationId is set', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'parent-1',
        branchType: 'STANDALONE',
      });
      prismaMock.organization.update.mockResolvedValue({});
      prismaMock.organization.create.mockResolvedValue({
        id: 'branch-1',
        name: 'Branch Masjid',
        branchType: 'BRANCH',
        parentOrganizationId: 'parent-1',
      });
      await service.create({
        ...baseDto,
        name: 'Branch Masjid',
        parentOrganizationId: 'parent-1',
      });
      expect(prismaMock.organization.update).toHaveBeenCalledWith({
        where: { id: 'parent-1' },
        data: { branchType: 'HEADQUARTERS' },
      });
      expect(prismaMock.organization.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            parentOrganizationId: 'parent-1',
            branchType: 'BRANCH',
          }),
        }),
      );
    });

    it('throws when parent not found', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ ...baseDto, parentOrganizationId: 'nonexistent' }),
      ).rejects.toThrow(BadRequestException);
      expect(prismaMock.organization.create).not.toHaveBeenCalled();
    });

    it('does not update parent when already HEADQUARTERS', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'parent-1',
        branchType: 'HEADQUARTERS',
      });
      prismaMock.organization.create.mockResolvedValue({
        id: 'branch-1',
        branchType: 'BRANCH',
      });
      await service.create({
        ...baseDto,
        parentOrganizationId: 'parent-1',
      });
      expect(prismaMock.organization.update).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('returns organization with parent and branches', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'org-1',
        name: 'Test',
        authority: {},
        parentOrganization: null,
        branches: [],
      });
      const result = await service.findById('org-1');
      expect(result).toBeDefined();
      expect(result.id).toBe('org-1');
    });

    it('throws when not found', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBranches', () => {
    it('returns branches of organization', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({ id: 'org-1' });
      prismaMock.organization.findMany.mockResolvedValue([{ id: 'b1', name: 'Branch 1' }]);
      const result = await service.findBranches('org-1');
      expect(result).toHaveLength(1);
      expect(prismaMock.organization.findMany).toHaveBeenCalledWith({
        where: { parentOrganizationId: 'org-1' },
        include: { authority: true },
      });
    });

    it('throws when org not found', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null);
      await expect(service.findBranches('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findParent', () => {
    it('returns parent organization', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'branch-1',
        parentOrganization: { id: 'parent-1', name: 'Parent' },
      });
      const result = await service.findParent('branch-1');
      expect(result.id).toBe('parent-1');
    });

    it('throws when org has no parent', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'org-1',
        parentOrganization: null,
      });
      await expect(service.findParent('org-1')).rejects.toThrow(NotFoundException);
    });

    it('throws when org not found', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null);
      await expect(service.findParent('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
