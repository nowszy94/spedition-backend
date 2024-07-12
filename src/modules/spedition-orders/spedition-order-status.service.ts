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
        new Date(speditionOrder.unloading[0].date),
      );

      return {
        ...speditionOrder,
        status: 'CREATED',
        orderId: newOrderId,
      };
    }

    let loading = speditionOrder.loading;
    let unloading = speditionOrder.unloading;

    if (toStatus === 'LOADED') {
      loading = loading.map((loadingItem) => ({
        ...loadingItem,
        completed: true,
      }));
    }

    if (toStatus === 'UNLOADED') {
      unloading = unloading.map((unloadingItem) => ({
        ...unloadingItem,
        completed: true,
      }));
    }

    // TODO add state machine
    return {
      ...speditionOrder,
      loading,
      unloading,
      status: toStatus,
    };
  }
}
