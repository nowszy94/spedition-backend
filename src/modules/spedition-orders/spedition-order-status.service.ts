import {
  SpeditionOrder,
  SpeditionOrderStatus,
} from './entities/spedition-order.entity';
import { Injectable } from '@nestjs/common';
import { NewOrderIdService } from './new-order-id.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SpeditionOrderStatusService {
  constructor(private readonly newOrderIdService: NewOrderIdService) {}

  async handleStatusChange(
    speditionOrder: SpeditionOrder,
    toStatus: SpeditionOrderStatus,
    user: User,
  ): Promise<SpeditionOrder> {
    const currentStatus = speditionOrder.status;

    if (toStatus === 'CREATED' && currentStatus === 'DRAFT') {
      const newOrderId = await this.newOrderIdService.createNewOrderId(
        user,
        new Date(speditionOrder.unloading.date),
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
