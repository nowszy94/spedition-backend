import { Test, TestingModule } from '@nestjs/testing';
import { SpeditionOrdersService } from './spedition-orders.service';

describe('SpeditionOrdersService', () => {
  let service: SpeditionOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeditionOrdersService],
    }).compile();

    service = module.get<SpeditionOrdersService>(SpeditionOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
