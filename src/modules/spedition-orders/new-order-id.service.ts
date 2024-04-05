import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewOrderIdService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor() {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  async createNewOrderId(companyId: string): Promise<string> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfCurrentMonthTime = startOfCurrentMonth.getTime();

    const orders = (
      await this.speditionOrderRepository.findAllSpeditionOrders(companyId)
    ).filter(({ status }) => status !== 'DRAFT');

    const thisMonthOrders = orders.filter(
      ({ creationDate }) => startOfCurrentMonthTime <= creationDate,
    );

    const nextOrderId = thisMonthOrders.length + 1;

    const normalCurrentMonth = currentMonth + 1;
    const preparedMonth =
      normalCurrentMonth >= 10 ? normalCurrentMonth : `0${normalCurrentMonth}`;

    return `${nextOrderId}/${preparedMonth}/${currentYear}`;
  }
}
