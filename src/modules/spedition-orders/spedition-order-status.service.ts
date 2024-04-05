import {
  SpeditionOrder,
  SpeditionOrderStatus,
} from './entities/spedition-order.entity';
import { Injectable } from '@nestjs/common';
import { NewOrderIdService } from './new-order-id.service';

@Injectable()
export class SpeditionOrderStatusService {
  constructor(private readonly newOrderIdService: NewOrderIdService) {}

  async handleStatusChange(
    speditionOrder: SpeditionOrder,
    toStatus: SpeditionOrderStatus,
  ): Promise<SpeditionOrder> {
    const currentStatus = speditionOrder.status;

    if (toStatus === 'CREATED' && currentStatus === 'DRAFT') {
      const newOrderId = await this.newOrderIdService.createNewOrderId(
        speditionOrder.companyId,
      );

      return {
        ...speditionOrder,
        status: 'CREATED',
        orderId: newOrderId,
      };
    }

    // TODO add state machine
    return {
      ...speditionOrder,
      status: toStatus,
    };
  }
}
