import { Injectable } from '@nestjs/common';

import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NewOrderIdService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor() {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  async createNewOrderId(user: User, forDate: Date): Promise<string> {
    const { companyId, preferredOrderIdSuffix } = user;

    const forYear = forDate.getFullYear();
    const forMonth = forDate.getMonth();

    const orders = (
      await this.speditionOrderRepository.findAll(companyId)
    ).filter(({ status }) => status !== 'DRAFT');

    const ordersInRequestedMonth = orders.filter(({ unloading }) => {
      const orderUnloadingMonth = new Date(unloading.date).getMonth();
      const orderUnloadingYear = new Date(unloading.date).getFullYear();

      return orderUnloadingYear === forYear && orderUnloadingMonth === forMonth;
    });

    const nextOrderId = ordersInRequestedMonth.length + 1;

    const normalizedMonthNumber = forMonth + 1;
    const preparedMonth =
      normalizedMonthNumber >= 10
        ? normalizedMonthNumber
        : `0${normalizedMonthNumber}`;

    return `${nextOrderId}/${preparedMonth}/${forYear}/${preferredOrderIdSuffix}`;
  }
}
