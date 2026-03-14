import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma';
import { JobsService } from '../jobs/jobs.service';

describe('HealthController', () => {
  let controller: HealthController;
  const prismaMock = {
    $queryRaw: jest.fn(),
  };
  const jobsMock = {
    isReady: jest.fn(),
  };

  beforeEach(async () => {
    prismaMock.$queryRaw.mockReset();
    jobsMock.isReady.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: prismaMock },
        { provide: JobsService, useValue: jobsMock },
      ],
    }).compile();
    controller = module.get<HealthController>(HealthController);
  });

  it('check returns status ok', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
  });

  it('live returns status alive', () => {
    expect(controller.live()).toEqual({ status: 'alive' });
  });

  it('ready returns status ready', async () => {
    prismaMock.$queryRaw.mockResolvedValue([1]);
    jobsMock.isReady.mockReturnValue(true);
    const result = await controller.ready();
    expect(result.status).toBe('ready');
    expect(result.checks.database).toBe('ok');
  });

  it('ready throws not_ready when db check fails', async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error('db down'));
    jobsMock.isReady.mockReturnValue(false);
    await expect(controller.ready()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
