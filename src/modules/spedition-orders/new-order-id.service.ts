import { Injectable } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { SpeditionOrderIdRepository } from './ports/spedition-order-id.repository';
import { DynamoDBSpeditionOrderIdRepository } from '../../infra/dynamodb/spedition-order-id/spedition-order-id.repository';

@Injectable()
export class NewOrderIdService {
  private readonly speditionOrderIdRepository: SpeditionOrderIdRepository;

  constructor() {
    this.speditionOrderIdRepository = new DynamoDBSpeditionOrderIdRepository();
  }

  async createNewOrderId(user: User, forDate: Date): Promise<string> {
    const { companyId, preferredOrderIdSuffix } = user;

    const forYear = forDate.getFullYear();
    const forMonth = forDate.getMonth();

    const nextOrderId =
      await this.speditionOrderIdRepository.getNextOrderIdForDate(
        companyId,
        forDate,
      );

    const normalizedMonthNumber = forMonth + 1;
    const preparedMonth =
      normalizedMonthNumber >= 10
        ? normalizedMonthNumber
        : `0${normalizedMonthNumber}`;

    return `${nextOrderId}/${preparedMonth}/${forYear}/${preferredOrderIdSuffix}`;
  }
}
