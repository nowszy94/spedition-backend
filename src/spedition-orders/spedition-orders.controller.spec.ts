import { Test, TestingModule } from '@nestjs/testing';
import { SpeditionOrdersController } from './spedition-orders.controller';
import { SpeditionOrdersService } from './spedition-orders.service';

describe('SpeditionOrdersController', () => {
  let controller: SpeditionOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeditionOrdersController],
      providers: [SpeditionOrdersService],
    }).compile();

    controller = module.get<SpeditionOrdersController>(
      SpeditionOrdersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
