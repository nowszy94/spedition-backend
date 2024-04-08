import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewOrderIdService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor() {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  async createNewOrderId(companyId: string, forDate: Date): Promise<string> {
    const forYear = forDate.getFullYear();
    const forMonth = forDate.getMonth();

    const orders = (
      await this.speditionOrderRepository.findAllSpeditionOrders(companyId)
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

    return `${nextOrderId}/${preparedMonth}/${forYear}`;
  }
}
