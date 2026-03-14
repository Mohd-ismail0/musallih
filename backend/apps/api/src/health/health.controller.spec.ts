import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
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
    const result = await controller.ready();
    expect(result.status).toBe('ready');
  });
});
