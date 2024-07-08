import { Injectable, Logger } from '@nestjs/common';
import { SpeditionOrdersRepository } from './ports/spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';

@Injectable()
export class RefreshSpeditionOrdersService {
  private readonly logger = new Logger(RefreshSpeditionOrdersService.name);
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor() {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  async refreshOrders(companyId: string) {
    const speditionOrders =
      await this.speditionOrderRepository.findAll(companyId);

    this.logger.debug(`To refresh ${speditionOrders.length} orders`);

    speditionOrders.forEach(async (order) => {
      await this.speditionOrderRepository.update(order);
    });

    this.logger.debug('successfully updated data');
  }
}
